import json
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    """Поиск продукта по штрихкоду через Open Food Facts API"""

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    params = event.get('queryStringParameters') or {}
    barcode = params.get('barcode', '').strip()

    if not barcode:
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Штрихкод не указан'})
        }

    url = f'https://world.openfoodfacts.org/api/v2/product/{barcode}?fields=product_name,product_name_ru,brands,nutriments,categories_tags,image_small_url,nutriscore_grade,quantity'

    req = urllib.request.Request(url, headers={'User-Agent': 'NutriScan/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {
            'statusCode': 404,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Продукт не найден'})
        }
    except Exception as e:
        return {
            'statusCode': 502,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Ошибка запроса к базе продуктов'})
        }

    if data.get('status') != 1:
        return {
            'statusCode': 404,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Продукт не найден в базе данных'})
        }

    p = data.get('product', {})
    n = p.get('nutriments', {})

    name = p.get('product_name_ru') or p.get('product_name') or 'Неизвестный продукт'
    brand = p.get('brands', '').split(',')[0].strip() if p.get('brands') else ''
    quantity = p.get('quantity', '')

    cal = round(n.get('energy-kcal_100g') or n.get('energy-kcal') or 0)
    protein = round((n.get('proteins_100g') or n.get('proteins') or 0), 1)
    fat = round((n.get('fat_100g') or n.get('fat') or 0), 1)
    carbs = round((n.get('carbohydrates_100g') or n.get('carbohydrates') or 0), 1)
    fiber = round((n.get('fiber_100g') or n.get('fiber') or 0), 1)
    sugar = round((n.get('sugars_100g') or n.get('sugars') or 0), 1)
    salt = round((n.get('salt_100g') or n.get('salt') or 0), 2)

    # Nutri-Score → числовая оценка здоровья 0–100
    grade_map = {'a': 95, 'b': 80, 'c': 62, 'd': 45, 'e': 25}
    nutriscore = p.get('nutriscore_grade', '').lower()
    score = grade_map.get(nutriscore, _calc_score(cal, protein, fat, sugar, fiber))

    categories = p.get('categories_tags', [])
    category = _translate_category(categories)

    result = {
        'barcode': barcode,
        'name': name,
        'brand': brand,
        'quantity': quantity,
        'category': category,
        'image': p.get('image_small_url', ''),
        'nutriscore': nutriscore.upper() if nutriscore else None,
        'score': score,
        'per100g': {
            'calories': cal,
            'protein': protein,
            'fat': fat,
            'carbs': carbs,
            'fiber': fiber,
            'sugar': sugar,
            'salt': salt,
        }
    }

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps(result, ensure_ascii=False)
    }


def _calc_score(cal: float, protein: float, fat: float, sugar: float, fiber: float) -> int:
    """Простой расчёт оценки здоровья если нет Nutri-Score"""
    score = 100
    if cal > 400: score -= 20
    elif cal > 250: score -= 10
    if fat > 20: score -= 15
    elif fat > 10: score -= 7
    if sugar > 20: score -= 15
    elif sugar > 10: score -= 7
    if protein > 10: score += 10
    elif protein > 5: score += 5
    if fiber > 5: score += 8
    elif fiber > 2: score += 4
    return max(10, min(99, score))


def _translate_category(tags: list) -> str:
    mapping = {
        'dairy': 'Молочные', 'milk': 'Молочные', 'yogurt': 'Молочные',
        'meat': 'Мясо', 'fish': 'Рыба', 'seafood': 'Морепродукты',
        'bread': 'Хлеб', 'cereals': 'Злаки', 'pasta': 'Паста',
        'fruits': 'Фрукты', 'vegetables': 'Овощи',
        'beverages': 'Напитки', 'juices': 'Соки', 'water': 'Вода',
        'snacks': 'Снеки', 'chocolate': 'Сладости', 'candy': 'Сладости',
        'oils': 'Масла', 'sauces': 'Соусы', 'cheese': 'Сыр',
        'eggs': 'Яйца', 'nuts': 'Орехи', 'legumes': 'Бобовые',
    }
    for tag in tags:
        tag_lower = tag.lower().replace('en:', '')
        for key, val in mapping.items():
            if key in tag_lower:
                return val
    return 'Продукт'

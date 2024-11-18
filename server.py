from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, redirect, url_for
app = Flask(__name__)
from data import data

id_count = 10

@app.route('/add_wine', methods=['POST'])
def add_wine():
    # Get the form data from the request
    form_data = request.form

    global id_count
    global data

    id_count +=1 

    flavor_lst = [form_data['flavor1'], form_data['flavor2'], form_data['flavor3']]
    image_flav = image_flav_finder(flavor_lst)
    print(image_flav)

    wine_entry = {
        'id': str(id_count),
        'name': form_data['name'],
        'year': int(form_data['year']),
        'region': form_data['region'],
        'subregion': form_data['subregion'],
        'city': form_data['city'],
        'displayname': form_data['displayname'],
        'winestyle': form_data['winestyle'],
        'image': form_data['image'],
        'alcohol_content': float(form_data['alcohol_content']),
        'winery': form_data['winery'],
        'flavorprofile': image_flav,
        'description': form_data['description'],
        'allergens': form_data['allergens']
    }

    data[wine_entry['id']] = wine_entry  
    print(data[wine_entry['id']])

    # return something that doesnt do anything
    return jsonify({'id': wine_entry['id']}), 201

@app.route('/edit_wine', methods=['POST'])
def edit_wine():
    # Get the form data from the request
    print("reached")
    form_data = request.form

    global data

    print(form_data)

    flavor_lst = [form_data['flavor1'], form_data['flavor2'], form_data['flavor3']]
    image_flav = image_flav_finder(flavor_lst)
    print(image_flav)

    wine_entry = {
        'id': str(id_count),
        'name': form_data['name'],
        'year': int(form_data['year']),
        'region': form_data['region'],
        'subregion': form_data['subregion'],
        'city': form_data['city'],
        'displayname': form_data['displayname'],
        'winestyle': form_data['winestyle'],
        'image': form_data['image'],
        'alcohol_content': float(form_data['alcohol_content']),
        'winery': form_data['winery'],
        'flavorprofile': image_flav,
        'description': form_data['description'],
        'allergens': form_data['allergens']
    }

    data[wine_entry['id']] = wine_entry  
    print(data[wine_entry['id']])

    # Return the edited wine
    return redirect(url_for('view', id=wine_entry['id']))

@app.route('/edit/<id>')
def edit(id):
    wine = data[str(id)]
    print(wine["flavorprofile"])
    return render_template('edit.html', wine=wine)

@app.route('/')
def home():
    return render_template('homepage.html')


def search_term(data, term):
    keys_to_search = ['name', 'year', 'region', 'subregion', 'city', 'displayname', 'winestyle', 'winery', 'flavorprofile']
    results = []

    convert_keys = {
        'name': 'Name',
        'year': 'Year',
        'region': 'Region',
        'subregion': 'Subregion',
        'city': 'City',
        'displayname': 'Type',
        'winestyle': 'Wine Style',
        'winery': 'Winery',
        'flavorprofile': 'Flavors'
    }

    for item in data:
        outer = {}
        context = {}

        for key in keys_to_search:
            if key in data[item]:
                if isinstance(data[item][key], dict):
                    for subkey in data[item][key]:
                        if term.lower() in subkey.lower():
                            term_start = subkey.lower().index(term.lower())
                            term_end = term_start + len(term)
                            context_start = max(0, term_start - 10)
                            context_end = min(len(subkey), term_end + 10)
                            context[convert_keys[key]] = subkey[context_start:context_end]
                else:
                    if term.lower() in str(data[item][key]).lower():
                        term_start = str(data[item][key]).lower().index(term.lower())
                        term_end = term_start + len(term)
                        context_start = max(0, term_start - 10)
                        context_end = min(len(str(data[item][key])), term_end + 10)
                        context[convert_keys[key]] = str(data[item][key])[context_start:context_end]

        if context:
            outer['item'] = data[item]
            outer['context'] = context
            results.append(outer)

    results.sort(key=lambda x: len(x['context']), reverse=True)
    return results

@app.route('/add')
def add():
    return render_template('add.html')

@app.route('/api/search-wine', methods=['GET'])
def search_wine():
    term = request.args.get('term', '') 
    results = search_term(data, str(term))
    return jsonify(results)

@app.route('/search')
def search():
    return render_template('search.html')

@app.route('/api/display-wines', methods=['GET'])
def display_wines():

    wine_list = [1,5,10]
    wine_list = [str(wine) for wine in wine_list]

    wines = {
        'redWine': {'id': wine_list[0], 'name': data[wine_list[0]]['name'], 'year': str(data[wine_list[0]]['year'])},
        'whiteWine': {'id': wine_list[1], 'name': data[wine_list[1]]['name'], 'year': str(data[wine_list[1]]['year'])},
        'specialityWine': {'id': wine_list[2], 'name': data[wine_list[2]]['name'], 'year': str(data[wine_list[2]]['year'])}
    }
    return jsonify(wines)
    

@app.route('/view/<id>')
def view(id):
    print(id)
    wine = data[id]
    return render_template('view.html', wine=wine)


def image_flav_finder(flavor_lst):

    result = {}

    # Create a copy of flavor_lst for ordering
    order_lst = flavor_lst.copy()

    for item in data:
        for flavor in data[item]["flavorprofile"]:
            if flavor in flavor_lst:
                result[flavor] = data[item]["flavorprofile"][flavor]
                flavor_lst.remove(flavor)

    ordered_result = {}

    for flavor in order_lst:
        if flavor in result:
            ordered_result[flavor] = result[flavor]

    return ordered_result


@app.route('/api/get_flavors', methods=['GET'])
def get_flavors():

    global_data = data

    flavors_lst = []

    for item in data:
        for flavor in data[item]["flavorprofile"]:
            flavors_lst.append(flavor)

    flavors = list(set(flavors_lst))
    return jsonify(flavors)

if __name__ == '__main__':
    app.run(debug=True)
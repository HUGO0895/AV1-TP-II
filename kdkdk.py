
import requests

API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImJiNDVmZDQzYjA0MjQyMjg5YzgwYmIzZGIyN2E0YTI4IiwiaCI6Im11cm11cjY0In0="  # pegue em openrouteservice.org
def buscar_coordenadas(endereco, api_key):
    url = "https://api.openrouteservice.org/geocode/search"
    params = {"api_key": api_key, "text": endereco}
    response = requests.get(url, params=params)
    data = response.json()
    coords = data["features"][0]["geometry"]["coordinates"]
    nome_encontrado = data["features"][0]["properties"]["label"]
    print(f"'{endereco}' -> encontrado como: '{nome_encontrado}' | coords: {coords}")
    return coords


def calcular_distancia(origem_coords, destino_coords, api_key):
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    params = {
        "api_key": api_key,
        "start": f"{origem_coords[0]},{origem_coords[1]}",
        "end": f"{destino_coords[0]},{destino_coords[1]}"
    }
    response = requests.get(url, params=params)
    data = response.json()
    segmento = data["features"][0]["properties"]["segments"][0]
    print(f"Distância crua (metros): {segmento['distance']}")  # confirma a unidade
    return {
        "distancia_km": round(segmento["distance"] / 1000, 1),
        "duracao_min": round(segmento["duration"] / 60)
    }

def calcular_gasolina(distancia_km, consumo_km_por_litro, preco_litro):
    litros = distancia_km / consumo_km_por_litro
    custo = litros * preco_litro
    return {
        "litros": round(litros, 2),
        "custo": round(custo, 2)
    }


def viagem_completa(endereco_origem, endereco_destino, consumo, preco_litro, api_key):
    origem = buscar_coordenadas(endereco_origem, api_key)
    destino = buscar_coordenadas(endereco_destino, api_key)
    
    distancia = calcular_distancia(origem, destino, api_key)
    gasolina = calcular_gasolina(distancia["distancia_km"], consumo, preco_litro)
    
    print(f"Distância: {distancia['distancia_km']} km")
    print(f"Tempo estimado: {distancia['duracao_min']} min")
    print(f"Gasolina necessária: {gasolina['litros']} litros")
    print(f"Custo estimado: R$ {gasolina['custo']}")
    
    return {**distancia, **gasolina}


# uso - teste rápido em São José dos Campos
viagem_completa(
    endereco_origem="Shopping Colinas, São José dos Campos",
    endereco_destino="Parque Vicentina Aranha,Rua Engenheiro Prudente de Morais, São José dos Campos",
    consumo=12,        # km/litro
    preco_litro=5.89,
    api_key=API_KEY
)
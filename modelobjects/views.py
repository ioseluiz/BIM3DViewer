import json
from django.shortcuts import render

from .models import Object

def home_view(request):
    context = {}
    # Get the model_objects
    model_objects = Object.objects.all()
    
    # Object Types
    object_types = ["Roof", "Stair", "Concrete Column", "Steel Section", "Floor", "Concrete Beam", "Isolated Footing"]

    # Convert to JSON
    data = []
    for obj in model_objects:
        info = {}
        info["number"] = obj.number
        info["object_name"] = obj.object_name
        info["description"] = obj.description
        info["object_type"] = obj.object_type
        data.append(info)
    json_data = json.dumps(data)
    context["model_objects"] = json_data
    context["object_types"] = object_types
    context["file"] = "modelo3D"

    return render(request, "home.html", context)

    

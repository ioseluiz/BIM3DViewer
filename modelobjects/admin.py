from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.shortcuts import render
from django import forms
from django.contrib import messages

from .models import Object

class CsvImportForm(forms.Form):
    csv_upload = forms.FileField()

class ObjectAdmin(admin.ModelAdmin):
    list_display = ('number', 'object_name', 'description','object_type')
    
    def get_urls(self):
        urls = super().get_urls()
        new_urls = [path('upload-csv/', self.upload_csv),]
        return new_urls + urls
    
    def upload_csv(self, request):
        if request.method == "POST":
            csv_file = request.FILES["csv_upload"]
            
            if not csv_file.name.endswith('.csv'):
                messages.warning(request, 'The wrong file type was uploaded')
                return HttpResponseRedirect(request.path_info)
            
            file_data = csv_file.read().decode("utf-8")
            csv_data = file_data.split("\n")
            
            for x in csv_data:
                fields = x.split(",")
                print(fields)
                # print(fields)
                created = Object.objects.update_or_create(
                    number = fields[0],
                    object_name = fields[1],
                    description = fields[2],
                    object_type = fields[3].replace("\r","")
                )
            url = reverse('admin:index')
            return HttpResponseRedirect(url)
            
        form = CsvImportForm()
        data = {"form": form}
        return render(request, "admin/csv_upload.html", data)
        

admin.site.register(Object, ObjectAdmin)


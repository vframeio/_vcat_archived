-----------------------

# Troubleshooting

During fresh install on Ubuntu 16.04

#### Import Data

- Create superuser `python manage.py createsuperuser`
- Sync hierarchy from gdocs `python manage.py sync_hierarchy`
- Import videos to mysql `python manage.py import_videos` takes a while

#### Django 2 Invitations

```
config/urls.py: add the line:
  app_name = "invitations"
models.py: update the line:
  from django.urls import reverse
base_invitation.py: add this to foreign key line:
  , on_delete=models.CASCADE
```


#### ../util/apiClient

[x] problem was case-sensitive matching `ApiClient.js`. Should be`apiClient.js`

(vframe) ➜  frontend git:(master) ✗ npm run build

> vcat-frontend@0.1.0 build /media/adam/adamt2b/work/undisclosed/vcat
> node frontend/scripts/build.js

Creating an optimized production build...
Failed to compile.

Module not found: Error: Can't resolve '../util/apiClient' in '/media/adam/adamt2b/work/undisclosed/vcat/frontend/src/actions'


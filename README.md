
<p align=center>
<img src="https://user-images.githubusercontent.com/100635212/192161740-a11e5fbc-d6ad-4cdc-b49a-93528fd96aae.png" width="130">
</p>

## Description

This is my little project, I'm working very hard on it and I'm sure it has a great future. Its development is underway and it is not finished yet. His name is KWIK :)


## License

[GPL-3.0 license](https://ru.wikipedia.org/wiki/GNU_General_Public_License#GPL_v3)


## Authors

- [@lubaskinc0de](https://github.com/lubaskinc0de)
- thanks to [@arte_m_etra](https://github.com/artemetra)
- and all python-antitoxic chat ❤️
- thanks to https://t.me/pydjango chat
  

## Badges

- ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
- ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
- ![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) ![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray)
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
- ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

## Features

- Authentication with email confirmation
- Flexibly customizable feed of posts
- Viewing a single post
- Likes, views, comments on posts
- A comment system with infinite nesting
- Up to 10 photos per post!
- Up to 10 photos per comment!
- Likes on comments
- Fully configured admin site
- Excellent optimization!
- And many, many more!

## Installation

```bash
git clone https://github.com/lubaskinc0de/Social-Net
```

```bash
cd Social-Net
```

Create a file .env along the path Social-Net/xfor/xfor/ and paste the following text content into it:

```txt
SECRET_KEY=securekey113833

EMAIL_HOST=your_email_host

EMAIL_PORT=your_email_port

EMAIL_HOST_USER=your_email

EMAIL_HOST_PASSWORD=your_password

POSTGRES_USER=hfhfk_user

POSTGRES_PASSWORD=very1338281strongpass

POSTGRES_DB=test_database

SQL_USER=hfhfk_user

SQL_PASSWORD=very1338281strongpass

SQL_HOST=backend_database

SQL_PORT=5432
```

Create a file .env along the path Social-Net/xfor-frontend/ and paste the following text content into it:

```txt
REACT_APP_BACKEND_URL=http://localhost:8000
```

Build images:

```sh
docker-compose up --build
```

Setup the database:

```sh
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

Optionally, you can also fill in the tables of geographical objects (this is quite a long operation)

```sh
docker-compose exec backend python manage.py cities_light
```
    
## Usage

Run containers:

```bash
docker-compose up
```

Down containers:

```bash
docker-compose down
```

## Running Tests

To run tests, run the following command

```bash
docker-compose exec backend python manage.py test
```

or

```bash
python manage.py test
```

## Support

For support, telegram [@LUBASKIN_CODE](https://t.me/LUBASKIN_CODE)


## Feedback

If you have any feedback, telegram [@LUBASKIN_CODE](https://t.me/LUBASKIN_CODE)


## Contributing

Contributions are always welcome!

# Screenshots

## Admin

![admin](https://user-images.githubusercontent.com/100635212/190927635-105da74d-b408-43de-8286-4b01d0280cd5.png)

![post_admin](https://user-images.githubusercontent.com/100635212/190927648-ac226f12-192a-4e82-8269-fb109ebff920.png)

![profile_admin](https://user-images.githubusercontent.com/100635212/190927649-c5396528-3cf6-4c70-9e39-81bbc2ac6fe0.png)

## Register

![formstep1](https://user-images.githubusercontent.com/100635212/190927638-3aa4c77a-eb9f-414f-86de-06998c753e91.png)

![formstep1errors](https://user-images.githubusercontent.com/100635212/190927639-b2d2e80a-3aa9-48eb-ac85-2e286e3c7657.png)

![formstep2](https://user-images.githubusercontent.com/100635212/190927640-57309602-814c-493b-a101-a3a00db81aa8.png)

![formstep3](https://user-images.githubusercontent.com/100635212/190927641-36e9680f-109e-4f78-9d1c-e18a071f7faa.png)

![formstep3datepicker](https://user-images.githubusercontent.com/100635212/190927642-f93eed2b-ffa5-4d11-bd4d-bff0cf346325.png)

![formstep4](https://user-images.githubusercontent.com/100635212/190927643-51938fd6-e440-4aa4-9d92-07a23b03803a.png)

![formstep4selected](https://user-images.githubusercontent.com/100635212/190927647-8b05b2ab-5d4d-49f7-9fd4-4866aeed6b16.png)

![formstep4errors](https://user-images.githubusercontent.com/100635212/190927645-e79931ff-6677-4aa4-b42c-d6ed16dcba4a.png)



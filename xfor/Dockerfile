# pull official base image
FROM python:3.10.3-alpine

# set work directory
WORKDIR /xfor/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install ruamel_yaml dependency
RUN apk add --no-cache gcc musl-dev python3-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /xfor/backend/entrypoint.sh
RUN chmod +x /xfor/backend/entrypoint.sh

# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/xfor/backend/entrypoint.sh"]
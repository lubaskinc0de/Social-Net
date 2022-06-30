import bs4
import requests
from bs4 import BeautifulSoup
from main.models import Post

class Lenta:
    '''
    This class parse lenta.ru
    its using to fill main page for perfomance tests
    '''

    URL = 'https://lenta.ru/parts/news/'

    @property
    def __document(self):
        document = BeautifulSoup(requests.get(self.URL).text,'lxml')
        return document
    
    def parse(self) -> None:
        '''This method parse data from lenta.ru and write it to DB'''
        doc = self.__document
        cards = doc.find_all('li',{'class':'parts-page__item'})
        for x in cards:
            x: bs4.element.Tag
            title = x.find('h3',{'class':'card-full-news__title'}).text if x.find('h3',{'class':'card-full-news__title'}) else None
            if title:
                link_to_full_news = x.find('a',{'class':'card-full-news'}).get('href')
            if not link_to_full_news.split('/')[0] == 'https:':
                cleaned_url = f"{self.URL.split('/')[0]}//{self.URL.split('/')[2]}{link_to_full_news}"
            else:
                cleaned_url = link_to_full_news
            full_news = BeautifulSoup(requests.get(cleaned_url).text,'lxml')

            if full_news.find('div',{'class':'topic-body__content'}):
                content = full_news.find('div',{'class':'topic-body__content'}).text
            else:
                content = '-'
            post = Post.objects.create(title=title or '',content=content,profile_id=2,author_id=2)
            post.liked.add(2)
        
parser = Lenta()
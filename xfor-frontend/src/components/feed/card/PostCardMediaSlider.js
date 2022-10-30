import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/lazy';
import {Lazy} from 'swiper';
import CardMedia from '@mui/material/CardMedia';

export default function PostCardMediaSlider(props) {
    return (
        <Swiper
            spaceBetween={50}
            modules={[Lazy]}
            slidesPerView={1}
            autoHeight
            lazy>
            {props.images.map((img) => {
                return (
                    <SwiperSlide key={img.photo}>
                        <CardMedia
                            component='img'
                            sx={{
                                maxHeight: '300px',
                            }}
                            onClick={() => props.handleModalOpen(img.photo)}
                            className='swiper-lazy'
                            data-src={img.photo}
                            alt=''
                        />
                    </SwiperSlide>
                );
            })}
        </Swiper>
    );
}

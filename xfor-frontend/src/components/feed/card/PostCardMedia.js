import React, {useState} from 'react';
import Modal from '../../utils/Modal';
import Slider from './PostCardMediaSlider';
import CardMedia from '@mui/material/CardMedia';

export default function PostCardMedia(props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageTarget, setModalImageTarget] = useState(null);

    const handleModalOpen = (src) => {
        setModalOpen(true);
        setModalImageTarget(src);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return props.images.length ? (
        <>
            <Slider
                handleModalOpen={handleModalOpen}
                images={props.images}></Slider>
            <Modal
                sx={{
                    p: 1,
                }}
                open={modalOpen}
                handleClose={handleModalClose}>
                <CardMedia
                    component='img'
                    sx={{
                        maxHeight: '500px',
                    }}
                    src={modalImageTarget}
                    loading='lazy'
                    alt=''
                />
            </Modal>
        </>
    ) : null;
}

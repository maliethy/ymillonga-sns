import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import ImagesZoom from './ImagesZoom';
import { backUrl } from '../config/config';
const PostImages = ({ images }) => {
    const [showImagesZoom, setShowImagesZoom] = useState(false);
    const onZoom = useCallback(() => {
        setShowImagesZoom(true);
    }, []);
    const onClose = useCallback(() => {
        setShowImagesZoom(false);
    }, []);

    if (images.length === 1) {
        return (
            <>
                <img role="presentation"
                    src={`${backUrl}/${images[0].src}`}
                    alt={images[0].src}
                    style={{
                        height: '300px',
                        cursor: 'pointer'
                    }}
                    onClick={onZoom} />
                {showImagesZoom && <ImagesZoom
                    images={images} onClose={onClose} />}
            </>
        );
    }
    if (images.length === 2) {
        return (
            <>
                <img role="presentation"
                    style={{
                        width: '50%',
                        display: 'inline-block',
                        cursor: 'pointer'
                    }}
                    src={`${backUrl}/${images[0].src}`}
                    alt={images[0].src}
                    onClick={onZoom} />
                <img role="presentation"
                    style={{
                        width: '50%',
                        display: 'inline-block',
                        cursor: 'pointer'
                    }}
                    src={`${backUrl}/${images[1].src}`}
                    alt={images[1].src}
                    onClick={onZoom} />
                {showImagesZoom && <ImagesZoom
                    images={images} onClose={onClose} />}
            </>
        );
    }
    return (
        <>
            <div>
                <img role="presentation"
                    style={{
                        width: '50%',
                        cursor: 'pointer'
                    }}
                    src={`${backUrl}/${images[0].src}`}
                    alt={images[0].src}
                    onClick={onZoom} />
                <div role="presentation"
                    style={{
                        width: '50%',
                        display: 'inline-block',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        cursor: 'pointer'
                    }}
                    onClick={onZoom}>
                    <PlusOutlined />
                    <br />
                    {images.length - 1}개의 사진 더 보기
        </div>
            </div>
            {showImagesZoom && <ImagesZoom
                images={images} onClose={onClose} />}
        </>
    );
};
PostImages.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default PostImages; 
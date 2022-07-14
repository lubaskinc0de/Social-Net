function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$(document).ready(function () {
    $('.like-form').on('submit', function (e) {
        var $this = $(this)
        var csrf = getCookie('csrftoken')
        var post_id = $this.children('input[name=post_id]').val()
        e.preventDefault()
        $.ajax({
            headers: { 'X-CSRFToken': csrf },
            data: { 'post_id': post_id },
            url: "/api/add-like/",
            method: 'PUT',
            success: function (response) {
                if (response.is_like == 'remove') {
                    $this.children('.lenta-card__svg--like-btn').children('.lenta-card__svg--like').css({ fill: '#fff' })
                    $this.parent('.lenta-card__body-icons--left').children('.lenta-card__likes-count').html(Number($this.parent('.lenta-card__body-icons--left').children('.lenta-card__likes-count').html()) - 1)
                } else if (response.is_like == 'add') {
                    $this.children('.lenta-card__svg--like-btn').children('.lenta-card__svg--like').css({ fill: '#ff0000' })
                    $this.parent('.lenta-card__body-icons--left').children('.lenta-card__likes-count').html(Number($this.parent('.lenta-card__body-icons--left').children('.lenta-card__likes-count').html()) + 1)
                }
            },
        })
    })

    $('.comment__like-form').on('submit', function (e) {
        e.preventDefault()
        var $this = $(this)
        var comment_id = $this.children('input[name=comment_id]').val()
        var csrf = getCookie('csrftoken')
        e.preventDefault()
        $.ajax({
            headers: { 'X-CSRFToken': csrf },
            data: { 'comment_id': comment_id },
            url: "/api/add-like-comment/",
            method: 'PUT',
            success: function (response) {
                if (response.is_like == 'remove') {
                    $this.children('.comment__like-btn').children('.comment__like-svg').css({ fill: '#fff' })
                    $this.children('.comment__like-btn').children('.comment__like-cnt').html(Number($this.children('.comment__like-btn').children('.comment__like-cnt').html()) - 1)
                } else if (response.is_like == 'add') {
                    $this.children('.comment__like-btn').children('.comment__like-svg').css({ fill: '#ff0000' })
                    $this.children('.comment__like-btn').children('.comment__like-cnt').html(Number($this.children('.comment__like-btn').children('.comment__like-cnt').html()) + 1)
                }
            }
        })
    })

    $('.lenta-card__slider').slick({
        Infinite: true,
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        arrows: true, // стрелки
        dots: false, // точки
        adaptiveHeight: true
    })

    $('.comment__images').slick({
        Infinite: true,
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        arrows: false, // стрелки
        dots: false, // точки
        adaptiveHeight: true
    })

    $('.lenta-card__comments-add-comment__form').on('submit', function (e) {
        let body = $(this).children('textarea[name=body]')
        let images = $(this).children('input[name=images]')
        console.log(images.val())
        if (!body.val() && !images.val()) {
            e.preventDefault()
            body.attr('placeholder', 'Комментарий не должен быть пустым')
            body.css('border-color', '#f52b2b85')
            setTimeout(function () { body.css('border-color', '#a39e9e') }, 1000)
        }
    })
})
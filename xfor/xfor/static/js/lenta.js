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
            headers: {'X-CSRFToken': csrf},
            data: {'post_id': post_id},
            url: "/api/add-like/",
            method: 'PUT',
            success(response) {
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

    $('.lenta-card__add-comment__form').on('submit', function (e) {
        var $this = $(this)
        var post_id = $this.children('input[name=post_id]').val()
        var csrf = getCookie('csrftoken')
        var message = $this.children('input[name=comment_input]')
        e.preventDefault()
        if(message.val().length >= 1) {
            $.ajax({
                headers: {'X-CSRFToken': csrf},
                data: {'post_id': post_id,'body': message.val()},
                url: "/api/add-lenta-comment/",
                method: 'POST',
                success(response) {
                    if(response.status == 'success') {
                        message.val('')
                        message.css('border-color','#00ff7383')
                        setTimeout(function(){message.css('border-color','#a39e9e')},1000)
                    } else {
                        message.attr('placeholder',response.error)
                        message.css('border-color','#f52b2b85')
                        setTimeout(function(){message.css('border-color','#a39e9e')},1000)
                    }
                },
                error(response) {
                    message.attr('placeholder','Ошибка сервера!')
                    message.css('border-color','#f52b2b85')
                    setTimeout(function(){message.css('border-color','#a39e9e')},1000)
                }
            })
        } else {
            message.attr('placeholder','Комментарий не должен быть пустым')
            message.css('border-color','#f52b2b85')
            setTimeout(function(){message.css('border-color','#a39e9e')},1000)
        }
    })
    
    if ($('#radio1').is(':checked')) {
        $('#radio2').attr('checked', false)
    }
    if ($('#radio2').is(':checked')) {
        $('#radio1').attr('checked', false)
    }
    
    $('.lenta-card__slider').slick({
        Infinite: true,
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        arrows: true, // стрелки
        dots: false, // точки
        adaptiveHeight: true
    })
    
    $('.cd-filter-trigger').on('click', function () {
        triggerFilter(true);
    });
    
    $('.cd-filter .cd-close').on('click', function () {
        triggerFilter(false);
    });
    
    document.querySelector('.cd-filter__submit--clear').addEventListener('click', e => {
        document.querySelector('#radio1').checked = false
        document.querySelector('#radio2').checked = false
        var $select = $('#ordering')
        $select.val([])
    })
    
    document.querySelector('#radio2').addEventListener('click', e => {
        document.querySelector('#radio1').checked = false
    })
    
    document.querySelector('#radio1').addEventListener('click', e => {
        document.querySelector('#radio2').checked = false
    })
    
    function triggerFilter($bool) {
        var elementsToTrigger = $([$('.cd-filter-trigger'), $('.cd-filter')]);
        elementsToTrigger.each(function () {
            $(this).toggleClass('filter-is-visible', $bool);
        });
    }
})
function validateimg(input) {
    if (input.files[0] != undefined) {
        const fileSize = input.files[0].size / 1024 / 1024; // in MiB
        if (fileSize > 8) {
            alert('Фото больше 8 мб!');
            $('.fileinput').val(''); //for clearing with Jquery
        } else if (input.files.length > 10) {
            alert('Нельзя загрузить больше 10 фото')
            $('.fileinput').val('');
        }
    }
}

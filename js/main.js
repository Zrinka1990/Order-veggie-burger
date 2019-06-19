let cart = 0;

function addBurger(id, name, description, price, energy) {
    let html = '';
    html += '<div class="burger" data-id="' + id + '">';
    html += '<div class="name">' + name + '</div>'
    html += '<img src="assets/burger.jpg" />'
    html += '<div class="description">' + description + '</div>';
    html += '<div class="price">' +  '$ ' + price + '</div>';
    html += '<div class="buttons">'
    html += '<button class="burger-add">Add to cart</button>';
    html += '<button class="burger-remove">Remove</button>'
    html += '</div>'
    html += '<div class="energy-eontainer">'
    html += '<a class="energy-link" href="#">Energy value</a>';
    html += '<div class="energy">' + energy + ' kcal </div>';
    html += '</div>'
    html += '</div>'

    $('#container').prepend(html);
}

$(document).ready(function(){

    $('#container').on('click','.energy-link', function(event){
        event.preventDefault();
    
        $(this).parent().find('.energy').slideToggle('slow');
        $(this)
          .animate({ "opacity": 0.5, "margin-left": 10 }, 150)
          .animate({ "opacity": 1.0, "margin-left": 0 }, 150);
    });

    $('#container').on('click', '.burger-remove', function(){
        $(this).parent().parent().remove();
    });
    
    $.ajax('data/burgers.json', {
        dataType: 'json',
        contentType: 'application/json',
        cache: false,
    })
    .done(function(response) {
        let burgers = response.burgers;
        burgers.forEach(function(burger){
            addBurger(burger.id, burger.name, burger.description, burger.price, burger.energy); 
        });
    })
    .fail(function(request, errorType, errorMessage){
        console.log(errorMessage);
    })
    .always(function(){

    });   

    $('#container').on('click','.burger-add',function(){
        let id = $(this).parent().data('id');
    
        $.ajax('data/addToCart.json', {
          type: 'post',
          data: { id: id },
          dataType: 'json',
          contentType: 'application/json'
        })
        .done(function(response) {
          if (response.message === 'success') {
            let price = response.price;
    
            cart += price;
    
            $('#order-container').text('$ ' + cart);
          }
        });
    });

    $('#soup-checkbox').on('change',function(){
        if ($(this).is(':checked')) {
          $('#soups').fadeIn();
        } else {
          $('#soups').fadeOut();
        }
      });
    $('#soup-checkbox').trigger('change');

    $('#order-form').on('submit',function(event){
        event.preventDefault();
    
        let data = { form: $(this).serialize(), price: cart };
    
        $.ajax($(this).attr('action'), {
          type: 'post',
          data: data
        })
        .done(function(response){
          $('#feedback-message').text(response.message);
        });
    });
});

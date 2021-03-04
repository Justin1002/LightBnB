$(() => {
  const DateUTC = new Date(Date.now())
  const today = DateUTC.toLocaleDateString()

  const $newResoForm = $(`
  <form action="" method="post" id="new-reso-form" class="new-reso-form">
    <div class="new-reso-form__field-wrapper">
      <label for ="start">Start date:</label>
      <input type ="date" id ="start" value="${today}"  min="${today}"> 
      <label for ="start">End date:</label>
      <input type ="date" id ="end" value="${today}"  min="${today}"> 
    </div>

    <div class="new-reso-form__field-wrapper">
    <button type ='Button'>Create</button>
    <a id="reso-form__cancel" href="#">Cancel</a>
    </div>

  </form>
  `)
  window.$newResoForm = $newResoForm;

  // $newResoForm.on('submit', function(event) {
  //   event.preventDefault();
  //   const data = $(this).serialize();

  //   getAllListings(data).then(function( json ) {
  //     propertyListings.addProperties(json.properties);
  //     views_manager.show('listings');
  //   });
  // });

  // $('body').on('click', '#search-property-form__cancel', function() {
  //   views_manager.show('listings');
  //   return false;
  // });

});
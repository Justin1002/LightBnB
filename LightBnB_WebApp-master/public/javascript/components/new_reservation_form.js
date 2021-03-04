$(() => {
  const DateUTC = new Date(Date.now())
  const today = DateUTC.toISOString().split('T')[0]
  const $newResoForm = $(`
  <form action = "/api/reservations" method="post" id="new-reso-form" class="new-reso-form">
    <div class="new-reso-form__field-wrapper">
      <label for ="start">Start date:</label>
      <input type ="date" id ="start" name="start_date" value="${today}"  min="${today}"> 
      <label for ="start">End date:</label>
      <input type ="hidden" id="propertyid" name="property_id" value="placeholder">
      <input type ="date" id ="end" name ="end_date" value="${today}"  min="${today}"> 
    </div>

    <div class="new-reso-form__field-wrapper">
    <button type ='submit'>Create</button>
    <a id="reso-form__cancel" href="#">Cancel</a>
    </div>

  </form>
  `)
  window.$newResoForm = $newResoForm;

  $newResoForm.on('submit', function(event) {
    event.preventDefault();
    const propertyID = $('body').data().propID.toString()
    $('input[name="property_id"]').attr('value', propertyID)

    const data = $(this).serialize();
    
    submitReservation(data)
      .then(() => {
        alert('Success')
        propertyListings.clearListings();
        getAllReservations()
          .then(function(json) {
            propertyListings.addProperties(json.reservations, true);
            views_manager.show('listings');
          })
      })
      .catch((error) => {
        console.error(error);
        views_manager.show('listings');
      })
    });
  
    $('body').on('click', '#reso-form__cancel', function() {
      views_manager.show('listings');
      return false;
    });

});

  // $('body').on('click', '#search-property-form__cancel', function() {
  //   views_manager.show('listings');
  //   return false;
  // });

$(() => {
  window.propertyListing = {};
  let selectedProperty = {};
  function createListing(property, isReservation, myListing) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation && !myListing ? 
            `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>` 
            : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">$${property.cost_per_night/100.0}/night</div>
          </footer>
          ${isReservation || myListing ? 
            ``
            : `<form id='reso'>
            <button type ="submit" value="${property.id}">Make a reservation</button>
            </form>`}
        </section>
      </article>
    `
  }

// Pass data in this property listings page to four things
// 1)
  
  window.propertyListing.createListing = createListing;


    $('body').on('submit','#reso', function(event) {
      event.preventDefault();
      const propID = event.target[0].value;
      $('body').data('propID',propID)
      views_manager.show('makeReso')
      console.log($('body').data())
    })
  

});
function addTestimonial()
  {
    var name = prompt("Please enter name for testimonial:","" );
    if (name == null || name == "")
    {}
  else
  {
    var txt = prompt("Please enter text for testimonial:","" );
    if (txt == null || txt == "")
    {}
  else
  {
    var data ={};
    data.name=name;
    data.text=txt;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/addTestimonial',            
      success: function(data) {
        console.log('success');
        if(JSON.stringify(data)=='"err"')
        {
          document.getElementById('testimonialNotification').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Problem occured!</div>';
        } 
        else
        { 
          document.getElementById('testimonialNotification').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> You added new testimonial!</div>';
          if(document.getElementById('noTestimonials')!=null){
            var notify=document.getElementById('noTestimonials');
            if(notify.style.display!="none")
              notify.style.display = "none";
          }
          var testi=document.getElementById('userTestimonials');
          console.log(testi);
          var brl=document.createElement('br');
          var par=document.createElement('p');
          par.innerHTML='<span class="w3-xlarge w3-margin-right">'+name+"</span></p><p>"+txt;
          testi.appendChild(par);
          testi.appendChild(brl);

        }
      }
});  
}
}
}
function delVenue(idV)
{
  console.log(idV);
  var data ={};
  data.idVenue=idV;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/deleteUserVenue',            
    success: function(data) {
      console.log('success');
      if(JSON.stringify(data)=='"err"')
      {
        document.getElementById('venueNotification').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Problem occured!</div>';
      } 
      else
      { 

        document.getElementById('venueNotification').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> You deleted venue successfully!</div>';
          // var lis = document.getElementById("navbar").getElementsByTagName("li");
          var lis=document.getElementById("venueTable").getElementsByTagName("tr");
          for(var i=0;i<lis.length;i++)
          {
            if(lis[i].id==idV)
            {
              lis[i].style.display = "none";
              break;
            }
          }
          console.log(JSON.stringify(data));
        }
      }

    });

}
function delGenre(idG)
{
  console.log(idG);
  var data ={};
  data.idGenre=idG;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/deleteUserGenre',            
    success: function(data) {
      console.log('success');
      if(JSON.stringify(data)=='"err"')
      {
        document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Problem occured!</div>';
      } 
      else
      { 

        document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> You deleted genre successfully!</div>';
          // var lis = document.getElementById("navbar").getElementsByTagName("li");
          var lis=document.getElementById("selectedGenres").getElementsByTagName("li");
          for(var i=0;i<lis.length;i++)
          {
            if(lis[i].id==idG)
            {
              lis[i].style.display = "none";
              break;
            }
          }
          console.log(JSON.stringify(data));
        }
      }

    });


}

function addNewGenreDb()
{
  var name = prompt("Please enter name for new genre:","" );
  if (name == null || name == "")
  {}
else{
  var data ={};
  data.name=name;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/addNewGenre',            
    success: function(data) {
      console.log('success');
      if(JSON.stringify(data)=='"err"')
      {
        document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Genre is not added to the list!</div>';
      } 
      else
      {  
       var li = document.createElement("li");
       li.id=data.id;
       var span = document.createElement('span');
       span.id=data.id;
       span.innerHTML ='<span id='+data.id+' class="close" onClick="delGenre(this.id)">&times;</span>';
       var t = document.createTextNode(name);
       li.appendChild(t);
       li.appendChild(span);
       document.getElementById("selectedGenres").insertBefore(li,document.getElementById("selectedGenres").childNodes[3]);
       document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> You added genre !</div>';
       
       if(document.getElementById('noDataGenres')!=null){
        var notify=document.getElementById('noDataGenres');
        if(notify.style.display!="none")
          notify.style.display = "none";
      }
      var tt = document.createTextNode(name);
      var boxGenres=document.getElementById('allGenre');
      var op=document.createElement('option');
      op.id=data.id;
      op.appendChild(tt);
      boxGenres.appendChild(op);
      console.log(JSON.stringify(data));
    }
  }

});
}
}


function addGenre()
{
  var genre=document.getElementById('allGenre');
  selectedIdGenre=genre[genre.selectedIndex].id;
  var data ={};
  data.idGenre=selectedIdGenre;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/addNewSelectedGenre',            
    success: function(data) {
      console.log('success');
      if(JSON.stringify(data)=='"err"')
      {

        document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Genre already on the list!</div>';
      } 
      else
      {  
       var li = document.createElement("li");
       li.id=selectedIdGenre;
       var span = document.createElement('span');
       span.id=selectedIdGenre;
       span.innerHTML ='<span id='+selectedIdGenre+' class="close" onClick="delGenre(this.id)">&times;</span>';
       var t = document.createTextNode(genre[genre.selectedIndex].value);
       li.appendChild(t);
       li.appendChild(span);
       document.getElementById("selectedGenres").insertBefore(li,document.getElementById("selectedGenres").childNodes[3]);
       document.getElementById('addNewGenre').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> You added genre !</div>';
       if(document.getElementById('noDataGenres')!=null){
        var notify=document.getElementById('noDataGenres');
        if(notify.style.display!="none")
          notify.style.display = "none";
      }
      console.log(JSON.stringify(data));
    }
  }

});
}
function freeDate()
{
 var data ={};
 data.date=document.getElementById('datePicker').value;
 console.log(data.date);
 $.ajax({
  type: 'POST',
  data: JSON.stringify(data),
  contentType: 'application/json',
  url: 'http://localhost:3000/create/removeBooking',            
  success: function(data) {
    console.log('success');                   
    if(JSON.stringify(data)=='"err"')
    {
      document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Some error!</div>';
    } 
    else
    { 
      document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Successfully removed booked date!</div>';
      document.getElementById('dateButton').innerHTML="";     
    }
  }                   }); 

}

function bookDate()
{
  var data ={};
  data.date=document.getElementById('datePicker').value;
  console.log(data.date);
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/create/addBooking',            
    success: function(data) {
      console.log('success');                   
      if(JSON.stringify(data)=='"err"')
      {
        document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Some error!</div>';
      } 
      else
      { 
        document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Successfully booked date!</div>';
        document.getElementById('dateButton').innerHTML="";     
      }
    }                   }); 
}

function addDate()
{
  var date=document.getElementById('datePicker').value;
  console.log(date);
  var data ={};
  data.date=date;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/checkDate',            
    success: function(data) {
      console.log('success');
      if(JSON.stringify(data)=='"err"')
      {
        document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> Date already booked!</div>';
        document.getElementById('dateButton').innerHTML='<button class="w3-button w3-light-grey w3-padding-large" onclick="freeDate()" ><i class="fa fa-calendar-times-o"></i> MAKE IT AVAILABLE</button>';
      } 
      else
      { 

        document.getElementById('booking').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> No booking for that date!</div>';
        
        document.getElementById('dateButton').innerHTML='<button class="w3-button w3-light-grey w3-padding-large" onclick="bookDate()" ><i class="fa fa-calendar-check-o"></i> BOOK THIS DATE</button>';
        console.log(JSON.stringify(data));
      }
    }

  });
}
function addVenue()
{
  var name=document.getElementById("addNameVenue").value;
  var type=document.getElementById("addTypeVenue").value;
  var location=document.getElementById("addLocationVenue").value;
  if(name!="" && type!="" && location!="")
  {
    var data ={};
    data.name=name;
    data.type=type;
    data.location=location;
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/addNewVenue',            
      success: function(data) {
        console.log('success');
        document.getElementById("addNameVenue").value="";
        document.getElementById("addTypeVenue").value="";
        document.getElementById("addLocationVenue").value="";
        var table = document.getElementById("venueTable");
        var row = table.insertRow(1);
        row.id=data.id;
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = name;
        cell2.innerHTML = type;
        cell3.innerHTML = location;
        cell4.innerHTML="<span id="+row.id+" class='close' onClick='delVenue(this.id)'>&times;</span>";
        document.getElementById('venueNotification').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> You added new venue!</div>';
        if(document.getElementById('noVenues')!=null){
          var notify=document.getElementById('noVenues');
          if(notify.style.display!="none")
            notify.style.display = "none";
        }
      }
    });
  }
  else
  {
    document.getElementById('venueNotification').innerHTML ='      <div id="editSuccess" class="alert alert-warning alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> Fill out all fields!</div>';
  }
}
function editBio() {
  var bio = prompt("Please enter bio about yourself:","" );
  if (bio == null || bio == "")
  {}
else
{
 var data ={};
 data.bio=bio;
 $.ajax({
  type: 'POST',
  data: JSON.stringify(data),
  contentType: 'application/json',
  url: 'http://localhost:3000/editBio',            
  success: function(data) {
    console.log('success');
    document.getElementById('userBio').innerHTML=bio;
    document.getElementById('editBioSuccess').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> You changed the bio!</div>';
    
  }
});
}
}
function editPrice() {
  var change=false;
  var changeMin=false;
  var changeMax=false;

  var maxHPrice;
  var minHPrice;
  console.log(maxHPrice+" "+minHPrice);
  var minPrice = prompt("Please enter minimum price per hour:", "1");
  if (minPrice == null || minPrice == "" || !Number.isInteger(parseInt(minPrice))) {
   var maxPrice = prompt("Please enter maximum price per hour:", "10");
   if (maxPrice == null || maxPrice == "" || !Number.isInteger(parseInt(maxPrice))) {
   }
   else
   {
    maxHPrice=parseInt(maxPrice);
    change=true;
    changeMax=true;
    document.getElementById("maxPricePerHour").innerHTML = maxPrice;
    document.getElementById("maxPricePerDay").innerHTML = parseInt(maxPrice)*24;
  }
} else {
 var maxPrice = prompt("Please enter maximum price per hour:", "10");
 if (maxPrice == null || maxPrice == "" || !Number.isInteger(parseInt(maxPrice))) {
  change=true;
  minHPrice=parseInt(minPrice);
  changeMin=true;
  document.getElementById("minPricePerHour").innerHTML = minPrice;
  document.getElementById("minPricePerDay").innerHTML = parseInt(minPrice)*24;
}
else
{
  change=true;
  changeMax=true;
  changeMin=true;
  minHPrice=parseInt(minPrice);
  maxHPrice=parseInt(maxPrice);
  document.getElementById("minPricePerHour").innerHTML = minPrice;
  document.getElementById("minPricePerDay").innerHTML = parseInt(minPrice)*24; 
  document.getElementById("maxPricePerHour").innerHTML = maxPrice;
  document.getElementById("maxPricePerDay").innerHTML = parseInt(maxPrice)*24;
}
}
if(change)
{
  var data ={};
  if(changeMin)
    {data.minPrice=minHPrice;
    }
    if(changeMax)
    {
      data.maxPrice=maxHPrice;  
    }
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: 'http://localhost:3000/editPrice',            
      success: function(data) {
        console.log('success');
        document.getElementById('editPriceSuccess').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> You changed the price!</div>';
      }
    }); 
  }
  
}

function editVideo()
{
  var link = prompt("Please enter new youtube video link:","" );
  if (link == null || link == "")
  {}
else
{
  var data ={};
  data.link=link;
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/editVideo',            
    success: function(data) {
      console.log('success');
      
      document.getElementById('editVideoSuccess').innerHTML ='      <div id="editSuccess" class="alert alert-success alert-dismissible "><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> You changed video link!</div>';
      document.getElementById('linkYoutube').src=data;
    }
  }); 
}
}
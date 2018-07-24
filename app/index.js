let API_URL = `http://localhost:3000`; // You API url/host

// Uplaod Logo
$("#uploadLogo").submit(function(e){
  e.preventDefault();

  var formdata = new FormData(this);

  $.ajax({
    url: `${API_URL}/api/upload`,
    type: "POST",
    data: formdata,
    mimeTypes:"multipart/form-data",
    contentType: false,
    cache: false,
    processData: false,
    success: function(){
      swal({
        type: 'success',
        title: 'Logo has been uploaded',
        showConfirmButton: false,
      },location.reload());
    },error: function(){
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      })
    }
  });
});

// Add record
$("#idForm").submit(function(e) {
  $.modal.close();
  let url = `${API_URL}/api/employees`;
  $.ajax({
     type: "POST",
     url: url,
     data: $("#idForm").serialize(), // serializes the form's elements.
     success: function(data)
     {
        swal({
          type: 'success',
          title: 'Record has been added',
          showConfirmButton: false,
        },location.reload());
     }
   });
  e.preventDefault(); // avoid to execute the actual submit of the form.
});

// Clear all the form fields
function clean() {
  document.getElementById("name").value = '';
  document.getElementById("position").value = '';
  document.getElementById("salary").value = '';
  document.getElementById("start_date").value = '';
  document.getElementById("office").value = '';
  document.getElementById("extn").value = '';
}

// Edit Record
function editRecord(id) {
  $('#extn').attr('disabled',`true`);
  $('#ex1').modal('open');
  $('#idForm').attr('onsubmit',`record(${id})`);

  $.get( `${API_URL}/api/employees/${id}`, function( response ) {
    let dArr ;

    if (response.data.start_date[4] === '-') {
      dArr =response.data.start_date.split("-");  // ex input "2010-01-18"
    } else if (response.data.start_date[4] === '/') {
      dArr =response.data.start_date.split("/");  // ex input "2010/01/18"
    }

    let dateFormat = dArr[0]+ "-" +dArr[1]+ "-" +dArr[2]; //ex out: "2010-01-18"

    document.getElementById("name").value = response.data.name;
    document.getElementById("position").value = response.data.position;
    document.getElementById("salary").value = response.data.salary.replace(/[^\w\s\n]/g,'');
    document.getElementById("start_date").value = dateFormat;
    document.getElementById("office").value = response.data.office;
    document.getElementById("extn").value = response.data.extn;
  });
}

// calling editRecord api
function record(id) {
  if (id) {
    $("#idForm").submit(function(e) {
      $.modal.close();
      let url = `${API_URL}/api/employees/${id}`;
      $.ajax({
         type: "PUT",
         url: url,
         data: $("#idForm").serialize(), // serializes the form's elements.
         success: function(data)
         {
            swal({
              type: 'success',
              title: 'Record has been updated',
              showConfirmButton: false,
            },location.reload());
         }
       });
      e.preventDefault(); // avoid to execute the actual submit of the form.
    });
  }
}


// deleteRecord
function deleteRecord(did) {
  swal({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      fetch(`${API_URL}/api/employees/${did}`, {
        method: 'delete'
      })
      .then(function(res) {
        console.log('delete-->', res);
        if (res.status === 200) {
          swal({
            type: 'success',
            title: 'Deleted!',
            text: 'Your record has been deleted.',
            showConfirmButton: true
          }).then((res) => {
            if (res.value) {
              location.reload();
            } else {
              swal({
                type: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
              })
            }
          })
        } else {
          swal({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
          })
        }
      });
    }
  })
}

// get base64 of img
let base64;

$.get( `${API_URL}/api/imgURL`, function( response ) {
  base64 = response.data;
  let logo = document.getElementById('logo');
  logo.src = base64;
});

// Display DataTable
$(document).ready( function () {
  $('#example').DataTable({
    "ajax": `${API_URL}/api/employees`,
      "columns": [
        { "data": "name" },
        { "data": "position" },
        { "data": "office" },
        { "data": "extn" },
        { "data": "start_date" },
        { "data": "salary" },
        { "data": null, render: function ( data, type, row ) {
          return `<button class="ui-button" onclick="editRecord(${data.id})">Edit</button> <button class="ui-button" onclick="deleteRecord(${data.id})">delete</button>`
          }
        }
      ],
      "processing": true,
      "responsive": true,
      "dom": 'Blfrtip',
      "buttons": [
        {
          extend: 'collection',
          text: 'Export',
          buttons: [
            {
             extend: 'copy',
             exportOptions: {
                  columns: [0,1,2,3,4]
              }
            },
            {
              text: 'Backup',
              action: function ( e, dt, button, config ) {
                let backupData;
                $.get( `${API_URL}/api/employees`, function( response ) {
                  backupData = {
                    employees: response.data
                  };
                  $.fn.dataTable.fileSave(
                      new Blob( [ JSON.stringify( backupData ) ] ),
                      'backup.json'
                  );
                });
              }
            },
            {
              extend: 'excel',
              footer: true,
              exportOptions: {
                columns: [0,1,2,3,4,5]
              }
            },
            {
              extend: 'csv',
              footer: true,
              exportOptions: {
                columns: [0,1,2,3,4,5]
              }
            },
            {
              text: 'Custom PDF',
              extend: 'pdfHtml5',
              filename: 'dt_custom_pdf',
              orientation: 'portrait', //portrait
              pageSize: 'A4', //A3 , A5 , A6 , legal , letter
              exportOptions: {
                columns: [0,1,2,3,4,5],
                search: 'applied',
                order: 'applied'
              },
              customize: function (doc) {
                //Remove the title created by datatTables
                doc.content.splice(0,1);
                //Create a date string that we use in the footer. Format is dd-mm-yyyy
                var now = new Date();
                var jsDate = now.getDate()+'-'+(now.getMonth()+1)+'-'+now.getFullYear();
                // Logo converted to base64
                // var logo = getBase64FromImageUrl('https://datatables.net/media/images/logo.png');
                // The above call should work, but not when called from codepen.io
                // So we use a online converter and paste the string in.
                // Done on http://codebeautify.org/image-to-base64-converter
                // It's a LONG string scroll down to see the rest of the code !!!
                var logo = base64;
                // A documentation reference can be found at
                // https://github.com/bpampuch/pdfmake#getting-started
                // Set page margins [left,top,right,bottom] or [horizontal,vertical]
                // or one number for equal spread
                // It's important to create enough space at the top for a header !!!
                doc.pageMargins = [20,60,20,30];
                // Set the font size fot the entire document
                doc.defaultStyle.fontSize = 7;
                // Set the fontsize for the table header
                doc.styles.tableHeader.fontSize = 7;
                // Create a header object with 3 columns
                // Left side: Logo
                // Middle: brandname
                // Right side: A document title
                doc['header']=(function() {
                  return {
                    columns: [
                      {
                        image: logo,
                        width: 50,
                        height: 30,
                        margin: [0,0,70,0]
                      },
                      {
                        alignment: 'left',
                        italics: true,
                        text: 'dataTables',
                        fontSize: 18,
                        margin: [10,0]
                      },
                      {
                        alignment: 'right',
                        fontSize: 14,
                        text: 'Custom PDF export with dataTables'
                      }
                    ],
                    margin: 20
                  }
                });
                // Create a footer object with 2 columns
                // Left side: report creation date
                // Right side: current page and total pages
                doc['footer']=(function(page, pages) {
                  return {
                    columns: [
                      {
                        alignment: 'left',
                        text: ['Created on: ', { text: jsDate.toString() }]
                      },
                      {
                        alignment: 'right',
                        text: ['page ', { text: page.toString() },  ' of ', { text: pages.toString() }]
                      }
                    ],
                    margin: 20
                  }
                });
                // Change dataTable layout (Table styling)
                // To use predefined layouts uncomment the line below and comment the custom lines below
                // doc.content[0].layout = 'lightHorizontalLines'; // noBorders , headerLineOnly
                var objLayout = {};
                objLayout['hLineWidth'] = function(i) { return .5; };
                objLayout['vLineWidth'] = function(i) { return .5; };
                objLayout['hLineColor'] = function(i) { return '#aaa'; };
                objLayout['vLineColor'] = function(i) { return '#aaa'; };
                objLayout['paddingLeft'] = function(i) { return 4; };
                objLayout['paddingRight'] = function(i) { return 4; };
                doc.content[0].layout = objLayout;
              }
            },
            {
              extend: 'print',
              title: 'DataTable',
              messageTop: 'The information in this table is copyright to Sirius Cybernetics Corp.',
              exportOptions: {
                columns: [0,1,2,3,4,5],
                search: 'applied',
                order: 'applied'
              },
              customize: function (win) {
                $(win.document.body).find('table, th, tr,td').css('border', 'solid','0.75');
                $(win.document.body).find('table, th, tr,td').css('border-collapse', 'collapse');
                $(win.document.body).find('h1').css('text-align','center');
              }
            }
          ]
        }
      ]
  });
});
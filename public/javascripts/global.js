// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $('#updateUser').hide()

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Add User button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    // Update User populate form
    $('#userList table tbody').on('click', 'td a.linkupdateuserform', updateUserForm);

    // UpdateUser
    btnUpdateUser
    $('#btnUpdateUser').on('click', updateUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // Stick our user data array into a userlist variable in the global object
        userListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.user_id + '</td>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.user_id + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td>' + this.firstname + '</td>';
            tableContent += '<td>' + this.middlename + '</td>';
            tableContent += '<td>' + this.lastname + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this.user_id + '">delete</a></td>';
            tableContent += '<td><a href="#" class="linkupdateuserform" rel="' + this.user_id + '">update</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User Info
function showUserInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var user_id = $(this).attr('rel');

    $.ajax({
            type: 'GET',
            url: '/users/getuser/' + $(this).attr('rel'),
            dataType: 'JSON'
    }).done(function( singleUser ) {
        console.log(singleUser[0]);
        // Check for successful (blank) response
        if (singleUser != null) {
            // Clear update form inputs
            $('#updateUser fieldset input').val('');

            var user = singleUser[0];
            
            //Populate User Box
            $('#userInfoFirstName').text(user.firstname);
            $('#userInfoLastName').text(user.lastname);
            $('#userInfoMiddleName').text(user.middlename);
            $('#userInfoEmail').text(user.email);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};

// Add User
function addUser(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'firstname': $('#addUser fieldset input#inputUserFirstName').val(),
            'middlename': $('#addUser fieldset input#inputUserMiddleName').val(),
            'lastname': $('#addUser fieldset input#inputUserLastName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'username': $('#addUser fieldset input#inputUserUserName').val(),
            'password': $('addUser fieldset input#inputUserPassword')
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function( response ) {
            
            // Check for successful (blank) response
            if (response["success"] === true) {

                alert('Success: ' + response["data"]);

                // Clear the form inputs
                $('#addUser fieldset input').val('');

                // Update the table
                populateTable();

            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteUser(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this user?');

    // Check and make sure the user confirmed
    if (confirmation === true) {
        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/' + $(this).attr('rel')
        }).done(function( response ) {
            console.log(response);
            // Check for a successful (blank) response
            if (response["success"] === true) {
                alert('Success: ' + response["data"]);

                // Update the table
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;
    }

};


//UPDATE USER
function updateUserForm(event) {
    // Prevent Link from Firing
    event.preventDefault();
    
    //Toggle the update view box
    $('#updateUser').toggle();

    $.ajax({
            type: 'GET',
            url: '/users/getuser/' + $(this).attr('rel'),
            dataType: 'JSON'
    }).done(function( singleUser ) {

        // Check for successful (blank) response
        if (singleUser != null) {
            // Clear update form inputs
            $('#updateUser fieldset input').val('');

            var user = singleUser[0];
            
            //Populate Update Box
            $('#inputUpdateUserFirstName').val(user.firstname);
            $('#inputUpdateUserLastName').val(user.lastname);
            $('#inputUpdateUserMiddleName').val(user.middlename);
            $('#inputUpdateUserUserName').val(user.username);
            $('#inputUpdateUserEmail').val(user.email);
            $('#inputUpdateUserPassword').val(user.password);
            $('#inputUpdateUserID').val(user.user_id);
        }
        else {
            // If something goes wrong, alert the error message that our service returned
            alert('Error: ' + response.msg);
        }
    });
};

//UPDATE USER
function updateUser(event) {
    // Prevent Link from Firing
    event.preventDefault();

    var updatedUser = {
        'user_id': $('#updateUser fieldset input#inputUpdateUserID').val(),
        'firstname': $('#updateUser fieldset input#inputUpdateUserFirstName').val(),
        'middlename': $('#updateUser fieldset input#inputUpdateUserMiddleName').val(),
        'lastname': $('#updateUser fieldset input#inputUpdateUserLastName').val(),
        'email': $('#updateUser fieldset input#inputUpdateUserEmail').val(),
        'username': $('#updateUser fieldset input#inputUpdateUserUserName').val(),
        'password': $('updateUser fieldset input#inputUpdateUserPassword').val()
    }

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to UPDATE this user?');
    if (confirmation === true) 
    {
        $.ajax({
            type: 'POST',
            data: updatedUser,
            url: '/users/updateuser/' + updatedUser.user_id,
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            console.log(response.data);

            if (response.success === true) {
                $('#updateUser fieldset input').val('');
                alert('USER UPDATED!');
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            $('#updateUser').hide();
            populateTable();
        });
    }
    else {
        // If they said no to the confirm, do nothing
        return false;

    }
};

$(document).ready(function () {

    getProductLists();
    document.getElementById('modalSubmit').addEventListener('click', modalSubmit);

    function modalSubmit(e) {
		
        let id = randomNumberID();     
        let productDescription = document.getElementById('productDescription').value;
		let itemInput = document.getElementById('itemInput').value;
        let imageData = document.getElementById('itemImage').toDataURL('image/jpeg');

        if (productDescription !== '' && itemInput !== '') {
            let newProduct = {
                id: id,
                image: imageData,
                description: productDescription
            };

            //Add new product to localStorage. The localStorage key for all the product is productList'
            if (localStorage.getItem("productList") === null || localStorage.getItem("productList") === []
                || localStorage.getItem("productList") === undefined) {
                let productList = [];
                productList.push(newProduct);
                localStorage.setItem("productList", JSON.stringify(productList));
            } else {
                let productList = JSON.parse(localStorage.getItem("productList"));
                productList.push(newProduct);
                localStorage.setItem("productList", JSON.stringify(productList));
            }
			getProductLists();
			resetForm();
			e.preventDefault();
        } else {
            alert('All fields are required. Please check your entries again');
        }
    }

});

//generate Id
function randomNumberID() {
    return Math.floor(Math.random() * (1000002 - 1 + 1)) + 1;
}

//get the data stored in the localStorage for display on load
function getProductLists() {
    if (localStorage.getItem("productList") === null) {
      //  setCounter(0);
        alert("Use the add button to add new item.");

    } else {

        let productList = JSON.parse(localStorage.getItem("productList"));

        // This sort element when use function dragable to sort items
        $("#productDisplay").sortable({
            stop : function(event, ui){
                let sortedIds = $(this).sortable( "toArray", { key: "set_" } );
                let productListSorted = [];
                for (let i = 0; i < sortedIds.length; i++){
                    for (let j = 0; j < sortedIds.length; j++){
                        if(productList[j].id == sortedIds[i]){
                            productListSorted.push(productList[j]);
                            //console.log (sorted[i]) ;
                        }
                    }
                }
                localStorage.setItem("productList", JSON.stringify(productListSorted));

            }
        });

        let productDisplay = document.getElementById('productDisplay');

        //Display elements 
        productDisplay.innerHTML = '';

        for (let i = 0; i < productList.length; i++) {

            let id = productList[i].id;
            let description = productList[i].description;
            let img =  productList[i].image;

            productDisplay.innerHTML += 
             '<li id="'+ id + '" class="list-group-item">' +
                '<div class="container"> ' +
                    '<div class="row"> '+
                        '<div class="col-6"> ' +
                            '<img class="imgCar" src="' + img + '"> ' +
                        '</div> ' +
                        '<div class="col-6"> ' +
                            '<p class="text-justify">' + description + '</p>' +
							'<button type="button" class="btn btn-success" onclick="editProduct(\'' + id + '\')" data-toggle="modal" data-target="#addNewProductModal">Edit</button>' +
                            '<button type="button" class="btn btn-danger"  onclick="deleteProduct(\'' + id + '\')">Delete</button>' +
                         '</div>' +                        
                     '</div>' +
                 '</div>'  +
            '</li>' ;

        }
        setCounter(productList.length);
    }
}

//Add element
function addProduct(id) {

    let productDescription = document.getElementById('productDescription').value;
    let imageData = document.getElementById('itemImage').toDataURL('image/jpeg');

    let productList = JSON.parse(localStorage.getItem("productList"));

    if (imageData !== '' && productDescription !== '') {
        let newProduct = {
            id: id,
            image: imageData,
            description: productDescription
        };
    
    //get position in grid when was edited
        for (let i = 0; i < productList.length; i++) {
            if (productList[i].id == id) {
                productList.splice(i, 1, newProduct);
            }
        }

        if (localStorage.getItem("productList") === null || localStorage.getItem("productList") === [] || localStorage.getItem("productList") === undefined) {
            let productList = [];
            localStorage.setItem("productList", JSON.stringify(productList));
        } else {
            localStorage.setItem("productList", JSON.stringify(productList));
        }
    }
}

// Edit an existen item
function editProduct(id) {
    "use strict";
    document.getElementById('modalSubmit').style.display = "none";
    document.getElementById("addNewProductModalLabel").textContent = "Edit Item";

    let parentDiv = document.getElementById('modalFooter');
    let productList = JSON.parse(localStorage.getItem("productList"));

    if (parentDiv.contains(document.getElementById("editButton"))) {
        document.getElementById('editButton').remove();
    }
	
    let editButton = document.createElement('button');
    editButton.id = "editButton";
    editButton.className = "fa fa-hdd-o btn btn-outline-primary btn-sm m-2";
    editButton.textContent = " Save data";
    parentDiv.appendChild(editButton);

    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == id) {
            document.getElementById("productDescription").value = productList[i].description;
            setCanvas(productList[i].image)

        }
    }

    document.getElementById("editButton").addEventListener("click", function () {
		addProduct(id);        
        getProductLists();
        resetForm();
        document.getElementById("editButton").style.display = "none";
        $(".addNewProduct").on('click', productFormReset());

    });

}

// deleting any element.
function deleteProduct(id) {
    let productList = JSON.parse(localStorage.getItem("productList"));
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].id == id) {
            productList.splice(i, 1);
            //console.log(result);
        }
    }
    localStorage.setItem("productList", JSON.stringify(productList)); //reset the values in the local storage
    getProductLists(); // to quickly display what is remaining from local storage.
}

//Clear data in form
function resetForm() {
    document.getElementById("productDescription").value = "";
    document.getElementById('itemInput').value  = "";
	clearCanvas();


}

//Clear Form 
function productFormReset() {
    document.getElementById('modalSubmit').style.display = "block";
    document.getElementById("addNewProductModalLabel").textContent = "New Product Form";
    document.getElementById('editButton').style.display = "none";
	resetForm();
}


// counts items
function setCounter(counter) {
    document.getElementById("counter").textContent = counter;
}

//Remove Canvas Img after add Car
function clearCanvas(){
	
	let canvas = document.getElementById('itemImage');
	let context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
}

//get image and set canvas in edition
function setCanvas(imagenData){

	let myCanvas = document.getElementById('itemImage');
    let ctx = myCanvas.getContext('2d');
	
    let img = new Image();
    img.src = imagenData;
    img.onload = function () {
       ctx.drawImage(img, 0, 0);   
    }
}



$("#itemInput").change(function(){
	readInput(this)
    //readURL(this);
})

//set canvas in addition
function readInput() {

	var canvas = document.getElementById('itemImage');
	var context = canvas.getContext('2d');
	var imageObj = new Image();
	
	imageObj.onload = function() {
              fitImageOn(canvas, imageObj);
	  };
	
			  var fitImageOn = function(canvas, imageObj) {
			 context.clearRect(0, 0, canvas.width, canvas.height);
			 //context.clearRect(0, 0, 320, 320);

			  var imageDimensionRatio = imageObj.width / imageObj.height;
			  var canvasDimensionRatio = canvas.width / canvas.height;
			  var renderableHeight, renderableWidth, xStart, yStart;
			  
			  if(imageDimensionRatio < canvasDimensionRatio) {
				
				renderableHeight = canvas.height;
				renderableWidth = imageObj.width * (renderableHeight / imageObj.height);
				xStart = (canvas.width - renderableWidth) / 2;
				yStart = 0;
			  } else if(imageDimensionRatio > canvasDimensionRatio) {
				
				renderableWidth = canvas.width
				renderableHeight = imageObj.height * (renderableWidth / imageObj.width);
				xStart = 0;
				yStart = (canvas.height - renderableHeight) / 2;
			  } else {
				
				renderableHeight = canvas.height;
				renderableWidth = canvas.width;
				xStart = 0;
				yStart = 0;
			  }
			  
			context.drawImage(imageObj, xStart, yStart, renderableWidth, renderableHeight);
		};
   
        
		
	  imageObj.src = URL.createObjectURL(event.target.files[0]);
};
 



	


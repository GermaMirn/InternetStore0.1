(function() {
    const toggleSwitch = document.getElementById('switch');

    const userMenu = document.getElementById("userMenu");
    const dropdownContent = document.getElementById("dropdownContent");

    function applyTheme(theme, type) {
        const divHeader = document.querySelector(".divHeader");
        const dropdownContent = document.getElementById("dropdownContent");
        const userMenu = document.getElementById("userMenu");

        if (theme === "light") {
            const headerComponent = document.querySelectorAll(".headerComponentDark");

            if (userMenu){
                const dropdownUrl = document.querySelectorAll(".dropdownUrlDark");

                dropdownContent.classList.add("dropdownContent")
                dropdownContent.classList.remove("dropdownContentDark")

                dropdownUrl.forEach(a => {
                    a.classList.remove("dropdownUrlDark");
                    a.classList.add("dropdownUrl");
                });
            }

            document.body.classList.add("lightTheme");
            document.body.classList.remove("darkTheme");
            divHeader.id = "divHeader";

            headerComponent.forEach(headerElement => {
                headerElement.classList.remove("headerComponentDark");
                headerElement.classList.add("headerComponent");
            });

        } else {
            const headerComponent = document.querySelectorAll(".headerComponent");

            if (userMenu){
                const dropdownUrl = document.querySelectorAll(".dropdownUrl");

                dropdownContent.classList.add("dropdownContentDark");
                dropdownContent.classList.remove("dropdownContent");

                dropdownUrl.forEach(a => {
                    a.classList.remove("dropdownUrl");
                    a.classList.add("dropdownUrlDark");
                });
            }

            document.body.classList.add("darkTheme");
            document.body.classList.remove("lightTheme");
            divHeader.id = "divHeaderDark";

            headerComponent.forEach(headerElement => {
                headerElement.classList.remove("headerComponent");
                headerElement.classList.add("headerComponentDark");
            });
        }

        if (type === "welcome") {
            const vkImg = document.getElementById("vkImg");
            const whatsappImg = document.getElementById("whatsappImg");

            if (theme === "light") {
                vkImg.src = "/static/store/images/vk.png";
                whatsappImg.src = "/static/store/images/whatsapp.png";
            } else {
                vkImg.src = "/static/store/images/vkDark.png";
                whatsappImg.src = "/static/store/images/whatsappDark.png";
            }
        }

        if (type === "searchPage") {
            let searchInput = document.querySelector(".searchInput, .searchInputDark");
            let currentPage = document.querySelector(".currentPage, .currentPageDark");
            let divForTag = document.querySelector(".divForTag, .divForTagDark");
            let buttonOfSearchInput = document.querySelector(".buttonOfSearchInput, .buttonOfSearchInputDark");
            let filter = document.getElementById("filter");
            let imgOfProduct = document.querySelectorAll(".imgOfProduct, .imgOfProductDark");
            let paginationButton = document.querySelectorAll(".paginationButton, .paginationButtonDark");

            if (theme === "light") {
                searchInput.classList.remove("searchInputDark");
                searchInput.classList.add("searchInput");
                currentPage.classList.remove("currentPageDark");
                currentPage.classList.add("currentPage");
                buttonOfSearchInput.classList.remove("buttonOfSearchInputDark")
                buttonOfSearchInput.classList.add("buttonOfSearchInput")

                if (divForTag) {
                    divForTag.classList.remove("divForTagDark");
                    divForTag.classList.add("divForTag");
                }

                filter.src = "/static/store/images/filter.png";
                imgOfProduct.forEach(img => {
                    img.classList.remove("imgOfProductDark");
                    img.classList.add("imgOfProduct");
                });
                paginationButton.forEach(pagination => {
                    pagination.classList.remove("paginationButtonDark");
                    pagination.classList.add("paginationButton");
                });
            } else {
                searchInput.classList.remove("searchInput");
                searchInput.classList.add("searchInputDark");
                currentPage.classList.remove("currentPage");
                currentPage.classList.add("currentPageDark");
                buttonOfSearchInput.classList.remove("buttonOfSearchInput")
                buttonOfSearchInput.classList.add("buttonOfSearchInputDark")

                if (divForTag){
                    divForTag.classList.remove("divForTag");
                    divForTag.classList.add("divForTagDark");
                }

                filter.src = "/static/store/images/filterDark.png";
                imgOfProduct.forEach(img => {
                    img.classList.remove("imgOfProduct");
                    img.classList.add("imgOfProductDark");
                });
                paginationButton.forEach(pagination => {
                    pagination.classList.remove("paginationButton");
                    pagination.classList.add("paginationButtonDark");
                });
            }
        }

        if (type === "productDetail") {
            let addButtonProduct = document.querySelector(".addButtonProduct, .addButtonProductDark");
            let addCommentButton = document.querySelectorAll(".addCommentButton, .addCommentButtonDark")

            if (theme === "light") {
                addButtonProduct.classList.remove("addButtonProductDark");
                addButtonProduct.classList.add("addButtonProduct");

                addCommentButton.forEach(submitButton => {
                    submitButton.classList.remove("addCommentButtonDark");
                    submitButton.classList.add("addCommentButton");
                });
            } else {
                addButtonProduct.classList.remove("addButtonProduct");
                addButtonProduct.classList.add("addButtonProductDark");

                addCommentButton.forEach(submitButton => {
                    submitButton.classList.remove("addCommentButton");
                    submitButton.classList.add("addCommentButtonDark");
                });
            }
        }

        if (type === "shoppingCart") {
            let btnChangeQuantity = document.querySelectorAll(".btnChangeQuantity, .btnChangeQuantityDark");
            let btnRemoveItem = document.querySelectorAll(".btnRemoveItem, .btnRemoveItemDark");
            let nameOfCartItem = document.querySelectorAll(".nameOfCartItem, .nameOfCartItemDark");
            let divOfCartItem = document.querySelectorAll(".divOfCartItem, .divOfCartItemDark");
            let selectedItem = document.querySelectorAll(".selectedItem, .selectedItemDark");
            let infoAboutSelectedCartItems = document.querySelector(".infoAboutSelectedCartItems, .infoAboutSelectedCartItemsDark");
            let orderButton = document.querySelector(".orderButton, .orderButtonDark");

            if (theme === "light") {
                nameOfCartItem.forEach(name => {
                    name.classList.remove("nameOfCartItemDark");
                    name.classList.add("nameOfCartItem");
                });

                selectedItem.forEach(selectedItem => {
                    selectedItem.classList.remove("selectedItemDark");
                    selectedItem.classList.add("selectedItem");
                });

                btnChangeQuantity.forEach(button => {
                    button.classList.remove("btnChangeQuantityDark");
                    button.classList.add("btnChangeQuantity");
                });

                btnRemoveItem.forEach(button => {
                    button.classList.remove("btnRemoveItemDark");
                    button.classList.add("btnRemoveItem");
                });

                divOfCartItem.forEach(cartItem => {
                    cartItem.classList.remove("divOfCartItemDark");
                    cartItem.classList.add("divOfCartItem");
                });

                if (infoAboutSelectedCartItems){
                    infoAboutSelectedCartItems.classList.remove("infoAboutSelectedCartItemsDark");
                    infoAboutSelectedCartItems.classList.add("infoAboutSelectedCartItems");
                };

                if (orderButton){
                    orderButton.classList.remove("orderButtonDark");
                    orderButton.classList.add("orderButton");
                };
            } else {
                nameOfCartItem.forEach(name => {
                    name.classList.remove("nameOfCartItem");
                    name.classList.add("nameOfCartItemDark");
                });

                selectedItem.forEach(selectedItem => {
                    selectedItem.classList.remove("selectedItem");
                    selectedItem.classList.add("selectedItemDark");
                });

                btnChangeQuantity.forEach(button => {
                    button.classList.remove("btnChangeQuantity");
                    button.classList.add("btnChangeQuantityDark");
                });

                btnRemoveItem.forEach(button => {
                    button.classList.remove("btnRemoveItem");
                    button.classList.add("btnRemoveItemDark");
                });

                divOfCartItem.forEach(cartItem => {
                    cartItem.classList.remove("divOfCartItem");
                    cartItem.classList.add("divOfCartItemDark");
                });

                if (infoAboutSelectedCartItems){
                    infoAboutSelectedCartItems.classList.remove("infoAboutSelectedCartItems");
                    infoAboutSelectedCartItems.classList.add("infoAboutSelectedCartItemsDark");
                };

                if (orderButton){
                    orderButton.classList.remove("orderButton");
                    orderButton.classList.add("orderButtonDark");
                };
            }
        }
    }

    function welcome(theme) {
        applyTheme(theme, "welcome");
    }

    function searchPage(theme) {
        applyTheme(theme, "searchPage");
    }

    function profile(theme) {
        applyTheme(theme, "profile");
    }

    function productDetail(theme){
        applyTheme(theme, "productDetail");
    }

    function shoppingCart(theme){
        applyTheme(theme, "shoppingCart")
    }

    document.addEventListener("DOMContentLoaded", function() {
        const nameOfPage = window.location.pathname;
        let theme = localStorage.getItem("theme") || "light";

        if (nameOfPage === "/welcome") {
            welcome(theme);
        } else if (nameOfPage === "/searchPage" || nameOfPage.includes("/searchPage/tag=")) {
            searchPage(theme);
        } else if (nameOfPage.includes("/user/")) {
            profile(theme);
        } else if (nameOfPage.includes("/searchPage/product/")) {
            productDetail(theme);
        } else if (nameOfPage === "/shoppingCart"){
            shoppingCart(theme);
        }

        toggleSwitch.checked = (theme === "dark");

        if (userMenu) {
            userMenu.addEventListener("click", function () {
                dropdownContent.style.display = dropdownContent.style.display === "none" || dropdownContent.style.display === "" ? "block" : "none";
            });

            window.addEventListener("click", function (event) {
                if (!userMenu.contains(event.target)) {
                    dropdownContent.style.display = "none";
                }
            });
        }
    });

    toggleSwitch.addEventListener("click", function() {
        const nameOfPage = window.location.pathname;
        let newTheme = toggleSwitch.checked ? "dark" : "light";
        localStorage.setItem("theme", newTheme);
        if (nameOfPage === "/welcome") {
            welcome(newTheme);
        } else if (nameOfPage === "/searchPage" || nameOfPage.includes("/searchPage/tag=")) {
            searchPage(newTheme);
        } else if (nameOfPage.includes("/user/")) {
            profile(newTheme);
        } else if (nameOfPage.includes("/searchPage/product/")) {
            productDetail(newTheme);
        } else if (nameOfPage === "/shoppingCart"){
            shoppingCart(newTheme);
        }
    });
})();
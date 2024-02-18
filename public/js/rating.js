'use strict'

function star() {
    let ratings = document.querySelectorAll(".rating");
    ratings.forEach((rating, index) => {
        
        rating.addEventListener("click", () => {

            if (rating.classList.contains('active')) {
                for (let i = index; i < ratings.length; i++) {
                    ratings[i + 1].classList.remove('active');
                }
            } else {
                for (let i = 0; i <= index; i++) {
                  ratings[i].classList.add('active');
                }
            }
        })
    })
}

star();

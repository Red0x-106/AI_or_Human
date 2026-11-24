const playButtons = document.querySelectorAll(".play-button");


playButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const game = button.dataset.game;

        if (game) {
            window.location.href = game;
        }

    });

});
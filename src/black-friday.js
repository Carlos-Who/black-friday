import './styles.scss';




document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,ScrollToPlugin,SplitText, GSDevTools);
    
    const blackFridayApp = document.getElementById('black-friday-app');
    
    // FAB
    const actionButton = document.getElementById('fab-trigger');
    const actionButtonPulse = document.getElementById('fab-pulse');
    const actionButtonLabel = document.querySelector('.fab__label');
    let actionButtonLabelSplit = SplitText.create(".fab__label");


    const modalSheetOverlay = document.getElementById('fab-modal-sheet-overlay');
    const modalSheet = document.getElementById('fab-modal-sheet');
    let isModalSheetOpen = false;
    let isClickable = true;


    console.log(actionButtonLabel);

    const modalSheetTimeLine = gsap.timeline({paused: true});


    modalSheetTimeLine.to(modalSheetOverlay, {
        autoAlpha: 1,
        duration: .3,
        ease: "none",
        y: "-100vh",
    })
    .to(modalSheet, {
        duration: .5,
        y: "-100vh",
        ease: "power1.out",
    }, "<25%");



    function modalAnimation() {

    }




    // function toggleModal() {
    //     if(!isModalSheetOpen) {
    //
    //         document.documentElement.classList.add('no-scroll');
    //         modalSheetTimeLine.play();
    //     } else {
    //         document.documentElement.classList.remove('no-scroll');
    //         modalSheetTimeLine.reverse();
    //     }
    //     isModalSheetOpen = !isModalSheetOpen;
    // }


    function closeModalOnScroll() {
        if(isModalSheetOpen) {
            modalSheetTimeLine.reverse();
            isModalSheetOpen = !isModalSheetOpen;
        }
    }




    const stickyChipTimeLine = gsap.timeline({
        scrollTrigger: {
            trigger: blackFridayApp,
            start: "40% 50%",
            end: "70% 50%",
            markers: false,
            onEnter: () => {
                console.log("Enter")
                stickyChipTimeLine.play();
            },
            onLeave: () => {
                console.log("Leave")
                isClickable = false;
                setTimeout(() => {
                    isClickable = true;
                }, 2000);
                closeModalOnScroll();
                stickyChipTimeLine.reverse();
            },
            onEnterBack: () => {
                console.log("Enter Back")
                stickyChipTimeLine.play();
            },
            onLeaveBack: () => {
                isClickable = false;
                setTimeout(() => {
                    isClickable = true;
                }, 2000);
                closeModalOnScroll();
                console.log("Leave Back")
                stickyChipTimeLine.reverse();
            },
        }});

    stickyChipTimeLine
        .from(actionButton, {
            autoAlpha: 0,
            duration: 0.5,
            scale: .5,
            yPercent: 10,
            ease: "back.out(1.8)",
        })
        .from(actionButtonPulse, {
            autoAlpha: 0,
            duration: 0.5,
            scale: 0,
            ease: "elastic.out(1, 0.5)",
        }, "<+=0.25")
        .to(actionButton, {
            duration: 1,
            width: "var(--maxButtonWidth)",
            ease: "back.out(1.6)",
            autoRound: false,
        })
        .to(".fab__label", {
            duration: 0.35,
            scaleX: "100%",
            marginLeft: () => actionButtonPulse.getBoundingClientRect().width,
            ease: "back.out(1.4)",
            autoRound: false,
        }, "<")
        .from(actionButtonLabelSplit.chars, {
            autoAlpha: 0,
            duration: 0.42,
            x: 10,
            stagger: { each: 0.028, ease: "power2.out" },
        }, "<50%");




    const fadeBtnTween = gsap.to(actionButton, {
        autoAlpha: 0,
        duration: 0.2,
        paused: true,
        overwrite: "auto",
        onStart: () => gsap.set(actionButton, { pointerEvents: "none" }),
        onReverseComplete: () => gsap.set(actionButton, { pointerEvents: "" })
    });

    const st = stickyChipTimeLine.scrollTrigger;


    // stickyChipTimeLine.from(actionButton, {
    //     scale: .5,
    //     yPercent: 150,
    //     duration:.8,
    //     ease: "elastic.out(0.3,0.3)",
    // })
    // .from(actionButtonPulse, {
    //     duration: 1,
    //     autoAlpha: 0,
    //     scale: 0,
    //     ease: "elastic.out(1.5,0.5)",
    // },"<+=0.4")
    // .to(actionButton, {
    //     width: "var(--maxButtonWidth)",
    //     duration:.7,
    //     ease: "elastic.out(0.3,1.3)",
    //     autoRound: false
    // })
    // .to(".fab__label", {
    //     scaleX: "100%",
    //     marginLeft: () => actionButtonPulse.getBoundingClientRect().width,
    //     autoRound: false
    // },"<+=0.4")
    // .from(actionButtonLabelSplit.chars, {
    //     autoAlpha: 0,
    //     duration:.5,
    //     x: 10,
    //     stagger:0.05
    // });


    // actionButton.addEventListener('click', (event) => {
    //     if (!isClickable) return;
    //     console.log('clicked');
    //     stickyChipTimeLine
    //         .to(actionButton, {
    //             autoAlpha: 0,
    //         })
    //     toggleModal();
    // });
    //
    // modalSheetOverlay.addEventListener('click', (event) => {
    //     stickyChipTimeLine
    //         .to(actionButton, {
    //             autoAlpha: 1,
    //         })
    //     toggleModal();
    // });



    actionButton.addEventListener("click", () => {
        if (!isClickable) return;
        fadeBtnTween.play(0); // desvanece sin tocar el timeline principal
        st?.disable();        // el scroll ya no podrá hacer reverse/play mientras el modal está abierto
        toggleModal(true);
    });

// 5) Cierre del modal (overlay): re-aparece el botón y reactivas el trigger
    modalSheetOverlay.addEventListener("click", (e) => {
        if (e.target !== e.currentTarget) return;
        toggleModal(false);
        fadeBtnTween.reverse(); // vuelve a alpha=1 (y pointer-events)
        st?.enable();           // el scroll vuelve a controlar el botón
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isModalSheetOpen) {
            toggleModal(false);
            fadeBtnTween.reverse();
            st?.enable();
        }
    });


    function toggleModal(open) {
        if (open) {
            document.documentElement.classList.add('no-scroll');
            modalSheetTimeLine.play();
            isModalSheetOpen = true;
        } else {
            document.documentElement.classList.remove('no-scroll');
            // si quieres esperar a que cierre para reactivar el scrollTrigger:
            modalSheetTimeLine.eventCallback('onReverseComplete', () => {
                st?.enable();
                modalSheetTimeLine.eventCallback('onReverseComplete', null);
            });
            modalSheetTimeLine.reverse();
            isModalSheetOpen = false;
        }
    }

    // GSDevTools.create({animation: stickyChipTimeLine});

});
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





    // TABS

    const tabItems = gsap.utils.toArray('.tab-item');
    const panels   = gsap.utils.toArray('.tab-details');
    const rightCol = document.querySelector('.tabs-container--right');

    const DURATION = 0.45;        // velocidad de la transición
    const EASE     = 'power2.out';
    const IN_OFFSET = 8;          // % de desplazamiento desde la derecha al entrar (sutil)
    const OUT_OFFSET = -4;        // % hacia la izquierda al salir (sutil)

    let activeIndex = Math.max(0, tabItems.findIndex(t => t.classList.contains('active')));
    if (activeIndex === -1) activeIndex = 0;

// Estado inicial
    gsap.set(panels, { opacity: 0, visibility: 'hidden', pointerEvents: 'none', position: 'absolute', inset: 0, xPercent: 0 });
    panels.forEach(p => p.classList.remove('is-active'));

    panels[activeIndex].classList.add('is-active');
    gsap.set(panels[activeIndex], { opacity: 1, visibility: 'visible', pointerEvents: 'auto', xPercent: 0 });

// Altura inicial del contenedor = altura del panel activo
    gsap.set(rightCol, { height: panels[activeIndex].scrollHeight });

// Timeline corriente (para evitar transiciones solapadas)
    let currentTween = null;

    function activate(index) {
        if (index === activeIndex || currentTween?.isActive()) return;

        const fromPanel = panels[activeIndex];
        const toPanel   = panels[index];

        // Medir altura destino
        // Preparar panel entrante fuera de vista a la derecha con opacidad 0 para medir sin parpadeo
        gsap.set(toPanel, { visibility: 'hidden', opacity: 0, pointerEvents: 'none', xPercent: IN_OFFSET });
        toPanel.classList.add('is-active');
        const targetHeight = toPanel.scrollHeight;

        // Reset: lo dejamos oculto hasta iniciar animación
        gsap.set(toPanel, { visibility: 'hidden', opacity: 0, pointerEvents: 'none', xPercent: IN_OFFSET });

        // Clases / aria
        tabItems[activeIndex].classList.remove('active');
        tabItems[index].classList.add('active');
        tabItems[activeIndex].setAttribute('aria-selected', 'false');
        tabItems[index].setAttribute('aria-selected', 'true');

        currentTween = gsap.timeline({
            defaults: { duration: DURATION, ease: EASE },
            onComplete: () => {
                // Estado final consistente
                panels.forEach((p, i) => {
                    if (i === index) {
                        p.classList.add('is-active');
                        gsap.set(p, { opacity: 1, visibility: 'visible', pointerEvents: 'auto', xPercent: 0 });
                    } else {
                        p.classList.remove('is-active');
                        gsap.set(p, { opacity: 0, visibility: 'hidden', pointerEvents: 'none', xPercent: 0 });
                    }
                });
                activeIndex = index;
            }
        });

        // 1) Ajusta altura del contenedor hacia el nuevo panel
        currentTween.to(rightCol, { height: targetHeight }, 0);

        // 2) Panel saliente: se desplaza levemente a la izquierda y se desvanece
        currentTween.to(fromPanel, { xPercent: OUT_OFFSET, opacity: 0, onStart: () => gsap.set(fromPanel, { pointerEvents: 'none' }) }, 0);

        // 3) Panel entrante: se hace visible, entra desde la derecha con fade-in
        currentTween
            .set(toPanel,   { visibility: 'visible' }, 0.05)
            .to(toPanel,    { xPercent: 0, opacity: 1, onStart: () => gsap.set(toPanel, { pointerEvents: 'auto' }) }, 0.05);
    }

// Click handlers
    tabItems.forEach((tab, i) => {
        tab.addEventListener('click', () => activate(i));
    });

// Recalcular altura en resize
//     window.addEventListener('resize', gsap.utils.debounce(() => {
//         gsap.set(rightCol, { height: panels[activeIndex].scrollHeight });
//     }, 150));








    // ------ TEXT MASK ------
    // https://gsap.com/community/forums/topic/42431-gsap-carousel/

    const defaultColor = "#333";
    const divHighlight = "#eee";
    const spanHighlight = "#d59400";
    const quoteSplit = SplitText.create(".quote p", {
        type:"words"
    })

    const numWords = quoteSplit.words.length;

    const tlx = gsap.timeline();

    quoteSplit.words.forEach((word, index) => {
        tlx.call(animateWord, [word], (index * 1) + 0.01)
    })

    tlx.set({}, {}, "+=0.01");


    function animateWord(word) {
        console.log(word.parentElement.nodeName)
        if(stx.direction == 1) {
            if(word.parentElement.nodeName == "P"){
                gsap.to(word, {color:divHighlight})
            } else {
                gsap.to(word, {color:spanHighlight})
            }

        } else {
            gsap.to(word, {color:defaultColor})
        }
    }

    let stx = ScrollTrigger.create({
        trigger:".quote",
        markers: true,
        start:"top 75%",
        end:"center 65%",
        scrub:true,
        animation:tlx
    })













});
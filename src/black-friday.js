import './styles.scss';

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const breakPoint = 800;
    const mm = gsap.matchMedia();

    mm.add(
        {
            isDesktop: `(min-width: ${breakPoint}px)`,
            isMobile: `(max-width: ${breakPoint - 1}px)`,
            reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
            const { isDesktop, reduceMotion } = ctx.conditions;

            const triggerEl = document.querySelector(".intro-details");
            if (!triggerEl) return;

            // Hack anti pixel-snapping en Firefox
            gsap.set(".mask", { rotation: 0.1 });

            // Define start/end según breakpoint
            const start = `top ${isDesktop ? "70%" : "90%"}`;
            const end   = `top ${isDesktop ? "50%" : "60%"}`;

            // Accesibilidad: si el usuario prefiere menos animación, salta al estado final
            if (reduceMotion) {
                gsap.set(".mask-img", { scale: 1 });
                gsap.set(".mask", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    scale: 0.95
                });
                return () => { /* limpieza custom si la necesitas */ };
            }

            // Timeline único, reactivo al breakpoint
            const tl = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                    trigger: triggerEl,
                    start,
                    end,
                    scrub: 1,
                    markers: true,                 // quita en producción
                    invalidateOnRefresh: true
                }
            });

            tl.from(".mask-img", { scale: 2 })
                .to(".mask", {
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
                }, 0)
                .to(".mask", { scale: 0.95, duration: 1 });

            // Nota: NO agregues listeners de resize manuales; matchMedia + ScrollTrigger ya refrescan.
            return () => {
                // Aquí solo limpieza custom si creas observers, etc.
                // ctx.revert() se llama automáticamente.
            };
        }
    );

    // Si en algún momento necesitas revertir todo:
    // mm.revert();
});



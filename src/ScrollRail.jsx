import { useEffect, useState } from "react";
import "./ScrollRail.css";

const experienceItems = ["dental", "developer", "gamemod"];

export default function ScrollRail() {
    const [active, setActive] = useState(0);
    const [position, setPosition] = useState({
        top: 0,
        height: 0,
        points: [0, 0, 0],
    });

    useEffect(() => {
        let frame;
        let animationFrame;
        let current = null;
        let target = null;

        const measure = () => {
            const section = document.getElementById("experience");
            const items = experienceItems.map((id) =>
                document.getElementById(id)
            );

            if (!section || items.some((item) => !item)) return;

            const sectionTop =
                section.getBoundingClientRect().top + window.scrollY;

            const centers = items.map((item) => {
                const rect = item.getBoundingClientRect();
                return rect.top + window.scrollY + rect.height / 2 - sectionTop;
            });

            target = {
                top: centers[0],
                height: Math.max(0, centers[2] - centers[0]),
                points: centers.map((center) => center - centers[0]),
            };

            if (!current) current = { ...target, points: [...target.points] };

            const trigger = window.innerHeight * 0.4;
            let nextActive = 0;

            items.forEach((item, index) => {
                if (item.getBoundingClientRect().top <= trigger) {
                    nextActive = index;
                }
            });

            setActive(nextActive);
        };

        const animate = () => {
            if (!current || !target) return;

            const ease = 0.18;

            current.top += (target.top - current.top) * ease;
            current.height += (target.height - current.height) * ease;

            current.points = current.points.map(
                (value, index) =>
                    value + (target.points[index] - value) * ease
            );

            setPosition({
                top: current.top,
                height: current.height,
                points: [...current.points],
            });

            const difference =
                Math.abs(target.top - current.top) +
                Math.abs(target.height - current.height) +
                target.points.reduce(
                    (sum, value, index) =>
                        sum + Math.abs(value - current.points[index]),
                    0
                );

            if (difference > 0.15) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        const update = () => {
            measure();
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(animate);
        };

        update();

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            cancelAnimationFrame(frame);
            cancelAnimationFrame(animationFrame);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <nav
            className="scroll-rail"
            aria-label="Experience timeline"
            style={{
                top: `${position.top}px`,
                height: `${position.height}px`,
            }}
        >
            <div className="scroll-rail-line" />
            <div
                className="scroll-rail-cursor"
                style={{
                    top: `${position.points[active] || 0}px`,
                }}
            />

            {experienceItems.map((id, index) => (
                <button
                    key={id}
                    type="button"
                    className={`scroll-rail-point ${active === index ? "active" : ""
                        }`}
                    style={{ top: `${position.points[index]}px` }}
                    onClick={() =>
                        document.getElementById(id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                        })
                    }
                    aria-label={`Go to ${id}`}
                    title={id}
                />
            ))}
        </nav>
    );
}
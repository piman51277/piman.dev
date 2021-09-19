class BezierCurve {
    static quadratic(x0, y0, x1, y1, x2, y2, steps) {

        const points = [];

        for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const t_sq = t * t;

            points.push([x0 * (1 - (2 * t) + t_sq) + x1 * (2 * (t - t_sq)) + x2 * t_sq, y0 * (1 - (2 * t) + t_sq) + y1 * (2 * (t - t_sq)) + y2 * t_sq]);
        }

        return points;
    }
    static quadratic_prime(x0, y0, x1, y1, x2, y2, steps) {

        const points = [];

        for (let step = 0; step <= steps; step++) {
            const t = step / steps;

            points.push([2 * (x0 * (t - 1) - x1 * (2 * t + 1) + x2 * t), 2 * (y0 * (t - 1) - y1 * (2 * t + 1) + y2 * t)]);
        }

        return points;
    }
    static cubic(x0, y0, x1, y1, x2, y2, x3, y3, steps) {

        const points = [];

        for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const t_sq = t * t;
            const t_cb = t_sq * t;
            points.push([x0 * (-t_cb + 3 * t_sq - 3 * t + 1) + x1 * (3 * t_cb - 6 * t_sq + 3 * t) + x2 * (-3 * t_cb + 3 * t_sq) + x3 * t_cb, y0 * (-t_cb + 3 * t_sq - 3 * t + 1) + y1 * (3 * t_cb - 6 * t_sq + 3 * t) + y2 * (-3 * t_cb + 3 * t_sq) + y3 * t_cb]);
        }

        return points
    }
    static cubic_prime(x0, y0, x1, y1, x2, y2, x3, y3, steps) {

        const points = [];

        for (let step = 0; step <= steps; step++) {
            const t = step / steps;
            const t_sq = t * t;

            points.push([3 * (x0 * (2 * t - t_sq - 1) + x1 * (2 * t_sq - 4 * t + 1) + x2 * (2 * t - 3 * t_sq) + t_sq*x3), 3 * (y0 * (2 * t - t_sq - 1) + y1 * (2 * t_sq - 4 * t + 1) + y2 * (2 * t - 3 * t_sq) + t_sq*y3)]);
        }

        return points;
    }
}
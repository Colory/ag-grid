import { Series } from "../series";
import { ChartAxisDirection } from "../../chartAxis";
import { SeriesMarker } from "../seriesMarker";
import { isContinuous, isDiscrete } from "../../../util/value";
export class CartesianSeries extends Series {
    constructor() {
        super(...arguments);
        this.directionKeys = {
            [ChartAxisDirection.X]: ['xKey'],
            [ChartAxisDirection.Y]: ['yKey']
        };
    }
    /**
     * Note: we are passing `isContinuousX` and `isContinuousY` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param x A domain value to be plotted along the x-axis.
     * @param y A domain value to be plotted along the y-axis.
     * @param isContinuousX Typically this will be the value of `xAxis.scale instanceof ContinuousScale`.
     * @param isContinuousY Typically this will be the value of `yAxis.scale instanceof ContinuousScale`.
     * @returns `[x, y]`, if both x and y are valid domain values for their respective axes/scales, or `undefined`.
     */
    checkDomainXY(x, y, isContinuousX, isContinuousY) {
        const isValidDatum = (isContinuousX && isContinuous(x) || isDiscrete(x)) &&
            (isContinuousY && isContinuous(y) || isDiscrete(y));
        return isValidDatum ? [x, y] : undefined;
    }
    /**
     * Note: we are passing the xAxis and yAxis because the calling code is supposed to make sure
     *       that series has both of them defined, and also to avoid one level of indirection,
     *       e.g. `this.xAxis!.inRange(x)`, both of which are suboptimal in tight loops where this method is used.
     * @param x A range value to be plotted along the x-axis.
     * @param y A range value to be plotted along the y-axis.
     * @param xAxis The series' x-axis.
     * @param yAxis The series' y-axis.
     * @returns
     */
    checkRangeXY(x, y, xAxis, yAxis) {
        return !isNaN(x) && !isNaN(y) && xAxis.inRange(x) && yAxis.inRange(y);
    }
}
export class CartesianSeriesMarker extends SeriesMarker {
    constructor() {
        super(...arguments);
        this.formatter = undefined;
    }
}
//# sourceMappingURL=cartesianSeries.js.map
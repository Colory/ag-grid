import { Series } from "../series";
import { ChartAxis, ChartAxisDirection } from "../../chartAxis";
import { SeriesMarker, SeriesMarkerFormatterParams } from "../seriesMarker";
import { isContinuous, isDiscrete } from "../../../util/value";
import { Annotation } from "../../annotation";
import { Group } from "../../../scene/group";

class SeriesAnnotations {

    constructor(
        private readonly series: CartesianSeries
    ) {
        // nothing to do here
    }

    private _xAxis?: Annotation[] = [];
    set xAxis(value: Annotation[] | undefined) {
        this._xAxis?.forEach(xAnnotation => this.series.detachAnnotation(xAnnotation));

        this._xAxis = value;

        this._xAxis?.forEach(xAnnotation => {
            xAnnotation.direction = ChartAxisDirection.X;
            this.series.attachAnnotation(xAnnotation);
        });
    }
    get xAxis(): Annotation[] | undefined {
        return this._xAxis;
    }

    private _yAxis?: Annotation[] = [];
    set yAxis(value: Annotation[] | undefined) {
        this._yAxis?.forEach(yAnnotation => this.series.detachAnnotation(yAnnotation));

        this._yAxis = value;
        this._yAxis?.forEach(yAnnotation => {
            yAnnotation.direction = ChartAxisDirection.Y;
            this.series.attachAnnotation(yAnnotation);
        });
    }
    get yAxis(): Annotation[] | undefined {
        return this._yAxis;
    }
}


export abstract class CartesianSeries extends Series {
    directionKeys: { [key in ChartAxisDirection]?: string[] } = {
        [ChartAxisDirection.X]: ['xKey'],
        [ChartAxisDirection.Y]: ['yKey']
    };

    private annotations?: SeriesAnnotations = new SeriesAnnotations(this);
    readonly annotationGroup: Group = new Group({ name: `${this.id}-Annotations` });

    constructor() {
        super();
        this.group.insertBefore(this.annotationGroup, this.seriesGroup);
    }

    attachAnnotation(annotation: Annotation) {
        this.annotationGroup.appendChild(annotation.group);
    }

    detachAnnotation(annotation: Annotation) {
        this.annotationGroup.removeChild(annotation.group);
    }

    update() {
        if (this.annotations) {
            this.updateAnnotations();
        }
    }

    updateAnnotations() {
        const xScale = this.xAxis?.scale;
        const yScale = this.yAxis?.scale;
        this.annotations?.xAxis?.forEach((xAnnotation) => {
            xAnnotation.xScale = xScale;
            xAnnotation.yScale = yScale;
            xAnnotation.update();
        });
        this.annotations?.yAxis?.forEach((yAnnotation) => {
            yAnnotation.xScale = xScale;
            yAnnotation.yScale = yScale;
            yAnnotation.update();
        });
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
    protected checkDomainXY<T, K>(x: T, y: K, isContinuousX: boolean, isContinuousY: boolean): [T, K] | undefined {
        const isValidDatum =
            (isContinuousX && isContinuous(x) || !isContinuousX && isDiscrete(x)) &&
            (isContinuousY && isContinuous(y) || !isContinuousY && isDiscrete(y));
        return isValidDatum ? [x, y] : undefined;
    }

    /**
     * Note: we are passing `isContinuousScale` into this method because it will
     *       typically be called inside a loop and this check only needs to happen once.
     * @param value A domain value to be plotted along an axis.
     * @param isContinuousScale Typically this will be the value of `xAxis.scale instanceof ContinuousScale` or `yAxis.scale instanceof ContinuousScale`.
     * @returns `value`, if the value is valid for its axis/scale, or `undefined`.
     */
    protected checkDatum<T>(value: T, isContinuousScale: boolean): T | string | undefined {
        if (isContinuousScale && isContinuous(value)) {
            return value;
        } else if (!isContinuousScale) {
            if (!isDiscrete(value)) {
                return String(value);
            }
            return value;
        }
        return undefined;
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
    protected checkRangeXY(x: number, y: number, xAxis: ChartAxis, yAxis: ChartAxis): boolean {
        return !isNaN(x) && !isNaN(y) && xAxis.inRange(x) && yAxis.inRange(y);
    }
}

export interface CartesianSeriesMarkerFormat {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    size?: number;
}

export class CartesianSeriesMarker extends SeriesMarker {
    formatter?: (params: CartesianSeriesMarkerFormatterParams) => CartesianSeriesMarkerFormat = undefined;
}

export interface CartesianSeriesMarkerFormatterParams extends SeriesMarkerFormatterParams {
    xKey: string;
    yKey: string;
}

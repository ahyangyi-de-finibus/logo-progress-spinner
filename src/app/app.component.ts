import {coerceNumberProperty} from '@angular/cdk/coercion';
import {DOCUMENT} from '@angular/common';
import {Component, Input, Inject, Optional} from '@angular/core';

const BASE_SIZE = 1;

const TEMPLATE = `
@keyframes rotate {
    0%      { stroke-dashoffset: 0;}
    100%    { stroke-dashoffset: PERIMETER;}
}
`

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'Spinner';

    private _strokeWidth: number;
    /**
     * Used for storing all of the generated keyframe animations.
     * @dynamic
     */
    private static styleTag: HTMLStyleElement|null = null;

    private static sizeFactors = new Set<number>([BASE_SIZE]);

    /** The sizeFactor of the progress spinner (will set width and height of svg). */
    @Input()
    get sizeFactor(): number { return this._sizeFactor; }
    set sizeFactor(sizeFactor: number) {
        this._sizeFactor = coerceNumberProperty(sizeFactor);

        if (!AppComponent.sizeFactors.has(this._sizeFactor)) {
            this._attachStyleNode();
        }
    }
    private _sizeFactor = BASE_SIZE;

    @Input()
    get strokeWidth(): number {
        return this._strokeWidth || this.sizeFactor * 1.0;
    }
    set strokeWidth(value: number) {
        this._strokeWidth = coerceNumberProperty(value);
    }

    get strokeDashArray(): string {
        return `${this._getPerimeter() * 0.6} ${this._getPerimeter() * 0.4}`;
    }

    constructor(@Optional() @Inject(DOCUMENT) private _document: any) {
    }

    private _getPerimeter(): number {
        var myPath = this._document.getElementById("F");
        return myPath.getTotalLength();
    }

    /** Dynamically generates a style tag containing the correct animation for this sizeFactor. */
    private _attachStyleNode(): void {
        let styleTag = AppComponent.styleTag;

        if (!styleTag) {
            styleTag = this._document.createElement('style');
            this._document.head.appendChild(styleTag);
            AppComponent.styleTag = styleTag;
        }

        if (styleTag && styleTag.sheet) {
            (styleTag.sheet as CSSStyleSheet).insertRule(this._getAnimationText(), 0);
        }

        AppComponent.sizeFactors.add(this.sizeFactor);
    }

    private _getAnimationText(): string {
        return TEMPLATE
        .replace(/PERIMETER/g, `${this._getPerimeter() * this._sizeFactor}`);
    }
}

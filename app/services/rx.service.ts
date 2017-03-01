import { Injectable } from '@angular/core';

import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';

@Injectable()
export class RxService {
    constructor() { }

    rxTest() {

        function customPromise() : Promise<String[]> {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve(['from promise']), 2000)
            });
        }
        const streamPromise = customPromise();
        const flattedSource = Observable
            .from(streamPromise)
            .flatMap(x => { return Observable.of(x) });

        const sourceConnectionA = Observable.interval(200)
            .do(n => { n + 1 })
            .bufferCount(2)
            .take(100)
            .concat(flattedSource)
            .publish()

        const sourceConnectionB = Observable.timer(3000, 1000)
            .merge(sourceConnectionA)
            .take(20)


        const subjectA = {
            next: (n: number[]) => {
                console.log(`NextA: ${n}`);
            },
            error: (err: string) => {
                console.log(`ErrorA:  ${err}`);
            },
            complete: () => {
                console.log('subjectA Completed');
            }
        }

        const subjectB = {
            next: (n: number[]) => {
                console.log(`NextB: ${n}`);
            },
            error: (err: string) => {
                console.log(`ErrorB:  ${err}`);
            },
            complete: () => {
                console.log('subjectB Completed');
            }
        }

        const flatted = {
            next: (val: String[]) : void => {
                console.log(`flatted: ${val}`);
            },
            error: (err: string) => {
                console.log(`flatted:  ${err}`);
            },
            complete: () => {
                console.log('flatted Completed');
            }
        }

        const behaviorSubscription = new BehaviorSubject('Ready');

        const behaviorSubject = {
            next: (message: string) => {
                console.log(`Behavior subject says: ${message}`);
            },
            error: (err: string) => {
                console.log(`Error:  ${err}`);
            },
            complete: () => {
                sourceConnectionA.connect();
                sourceConnectionA.subscribe(subjectA);
                flattedSource.subscribe(flatted);
                sourceConnectionB.subscribe(subjectB);
            }
        }

        behaviorSubscription.subscribe(behaviorSubject)
        behaviorSubscription.next('Steady')
        behaviorSubscription.next('Go');
        behaviorSubscription.complete();
    }
}

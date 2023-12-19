/*
* @license
* Copyright (C) Siemens AG 2020-2021 ALL RIGHTS RESERVED.
* Confidential.
*/
import { Inject, Injectable } from '@angular/core';
import { AreaOperationsStrategy } from '../strategy/area-operations-strategy';

@Injectable({
     /*
    * 'root' refers service is provided at root level
    */
    providedIn: 'root'
})
export class StrategyManagerService {

    constructor(@Inject(AreaOperationsStrategy) private readonly strategies: Array<AreaOperationsStrategy>) {
    }
     /*
    * Execute the stratergy
    */
    executeStrategy(selectedStrategy, operation, ...param) {
        const strategy = this.getStrategy(selectedStrategy);
        return strategy[operation](...param);
    }
     /*
    * Get the stratergy
    */
    private getStrategy(strategyName) {
        const strategy = this.strategies.find(_strategy => _strategy.getClassName() === strategyName);
        if (strategy === undefined) {
            return null;
        }
        return strategy;
    }
}

import { InjectionToken } from "@angular/core";
import { NgGcConfig } from "../types";

export const NGGC_API_CONFIG = new InjectionToken<NgGcConfig>(
    'NGGC_API_CONFIG'
)
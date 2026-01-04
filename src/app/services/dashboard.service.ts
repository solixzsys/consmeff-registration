import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { ActivityLog, DashboardMetrics, MoveStats, ProductContribution, SerStats, SerStatsRequest } from '../data/dashboard/metrics';
import { SupplyChainHierarchy } from '../data/analytics/analytics.data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
baseUrl=environment.baseUrl;
altUrl=environment.altUrl;
  constructor(private http:HttpClient) { }

  dashmetrics(email:string):Observable<DashboardMetrics>{
    return this.http.get<DashboardMetrics>(this.baseUrl+"/metric/dashboardmetrics?email="+email)
  }
  hierachytree(operationalid:string):Observable<SupplyChainHierarchy>{
    return this.http.get<SupplyChainHierarchy>(this.altUrl+"/analytics/hierarchy-tree?operationalid="+operationalid)
  }
  productcontribution(email:string):Observable<ProductContribution>{
    return this.http.get<ProductContribution>(this.baseUrl+"/metric/productstats?email="+email)
  }
  serializationTS(payload:SerStatsRequest):Observable<SerStats>{
    return this.http.get<SerStats>(`${this.baseUrl}/metric/serializationstats?email=${payload.email}&point=${payload.point}&pointcount=${payload.pointcount}`);
  }
  movementTS(payload:SerStatsRequest):Observable<MoveStats>{
    return this.http.get<MoveStats>(`${this.baseUrl}/metric/movementstats?email=${payload.email}&point=${payload.point}&pointcount=${payload.pointcount}`);
  }
  recentActivities(payload:{count:number,email:string}):Observable<ActivityLog>{
    return this.http.get<ActivityLog>(`${this.baseUrl}/metric/recentactivity?count=${payload.count}&email=${payload.email}`);
  }

}

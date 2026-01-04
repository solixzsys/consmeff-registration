import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BadgeModule } from 'primeng/badge';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { ListboxModule } from 'primeng/listbox';
import { SplitterModule } from 'primeng/splitter';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { ChipModule } from 'primeng/chip';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { StepperModule } from 'primeng/stepper';
import { InputOtpModule } from 'primeng/inputotp';
import { StepsModule } from 'primeng/steps';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TimelineModule } from 'primeng/timeline';
import { TreeModule } from 'primeng/tree';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router, RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ChartModule } from 'primeng/chart';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,ReactiveFormsModule,FormsModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule,
    DropdownModule,CalendarModule,ToastModule,DatePickerModule,ProgressSpinnerModule, 
  TabsModule, BadgeModule, ToggleSwitchModule,ToolbarModule, TableModule, IconFieldModule, InputIconModule, TagModule,
  SplitterModule,ListboxModule, CheckboxModule,CardModule,MultiSelectModule,DividerModule,DialogModule,PasswordModule,ChipModule,
  ChipModule, TimelineModule, TreeModule, FloatLabelModule,RouterModule,SidebarModule,AvatarModule,MenuModule,ChartModule,
   RadioButtonModule,BlockUIModule
  ],
  exports: [
    CommonModule,
    InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule,
    ReactiveFormsModule,FormsModule,DropdownModule,CalendarModule,ToastModule,DatePickerModule,ProgressSpinnerModule,
    TabsModule, BadgeModule, ToggleSwitchModule,ToolbarModule, TableModule, IconFieldModule, InputIconModule, TagModule,
    SplitterModule,ListboxModule, CheckboxModule,CardModule,MultiSelectModule,DividerModule,DialogModule,PasswordModule,ChipModule,
    SkeletonModule,ProgressBarModule,TooltipModule,MessageModule,StepperModule,InputOtpModule,StepsModule,ToggleButtonModule ,
    ChipModule,TimelineModule,TreeModule, FloatLabelModule ,RouterModule,SidebarModule,AvatarModule,MenuModule,ChartModule,
    RadioButtonModule,BlockUIModule
  ]
})
export class TraceabilityModule { }

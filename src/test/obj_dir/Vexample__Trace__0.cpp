// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_sc.h"
#include "Vexample__Syms.h"


void Vexample___024root__trace_chg_0_sub_0(Vexample___024root* vlSelf, VerilatedVcd::Buffer* bufp);

void Vexample___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root__trace_chg_0\n"); );
    // Init
    Vexample___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vexample___024root*>(voidSelf);
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (VL_UNLIKELY(!vlSymsp->__Vm_activity)) return;
    // Body
    Vexample___024root__trace_chg_0_sub_0((&vlSymsp->TOP), bufp);
}

void Vexample___024root__trace_chg_0_sub_0(Vexample___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root__trace_chg_0_sub_0\n"); );
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode + 1);
    // Body
    if (VL_UNLIKELY((vlSelf->__Vm_traceActivity[1U] 
                     | vlSelf->__Vm_traceActivity[2U]))) {
        bufp->chgBit(oldp+0,(vlSelf->example_tb__DOT__rst_in));
        bufp->chgCData(oldp+1,(vlSelf->example_tb__DOT__a_in),6);
        bufp->chgCData(oldp+2,(vlSelf->example_tb__DOT__b_in),6);
        bufp->chgIData(oldp+3,(vlSelf->example_tb__DOT__unnamedblk1__DOT__i),32);
        bufp->chgIData(oldp+4,(vlSelf->example_tb__DOT__unnamedblk1__DOT__unnamedblk2__DOT__j),32);
    }
    bufp->chgBit(oldp+5,(vlSelf->example_tb__DOT__clk_in));
    bufp->chgCData(oldp+6,(vlSelf->example_tb__DOT__c_out),5);
}

void Vexample___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vexample___024root__trace_cleanup\n"); );
    // Init
    Vexample___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vexample___024root*>(voidSelf);
    Vexample__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    vlSymsp->__Vm_activity = false;
    vlSymsp->TOP.__Vm_traceActivity[0U] = 0U;
    vlSymsp->TOP.__Vm_traceActivity[1U] = 0U;
    vlSymsp->TOP.__Vm_traceActivity[2U] = 0U;
}

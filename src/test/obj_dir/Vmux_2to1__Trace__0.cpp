// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_c.h"
#include "Vmux_2to1__Syms.h"


void Vmux_2to1___024root__trace_chg_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp);

void Vmux_2to1___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_chg_0\n"); );
    // Init
    Vmux_2to1___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmux_2to1___024root*>(voidSelf);
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (VL_UNLIKELY(!vlSymsp->__Vm_activity)) return;
    // Body
    Vmux_2to1___024root__trace_chg_0_sub_0((&vlSymsp->TOP), bufp);
}

void Vmux_2to1___024root__trace_chg_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_chg_0_sub_0\n"); );
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode + 1);
    // Body
    bufp->chgBit(oldp+0,(vlSelf->mux_2to1_tb__DOT__a));
    bufp->chgBit(oldp+1,(vlSelf->mux_2to1_tb__DOT__b));
    bufp->chgBit(oldp+2,(vlSelf->mux_2to1_tb__DOT__sel));
    bufp->chgBit(oldp+3,(((IData)(vlSelf->mux_2to1_tb__DOT__sel)
                           ? (IData)(vlSelf->mux_2to1_tb__DOT__b)
                           : (IData)(vlSelf->mux_2to1_tb__DOT__a))));
    bufp->chgBit(oldp+4,(vlSelf->mux_2to1_tb__DOT__clk));
}

void Vmux_2to1___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_cleanup\n"); );
    // Init
    Vmux_2to1___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmux_2to1___024root*>(voidSelf);
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VlUnpacked<CData/*0:0*/, 1> __Vm_traceActivity;
    for (int __Vi0 = 0; __Vi0 < 1; ++__Vi0) {
        __Vm_traceActivity[__Vi0] = 0;
    }
    // Body
    vlSymsp->__Vm_activity = false;
    __Vm_traceActivity[0U] = 0U;
}

// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_c.h"
#include "Vtest__Syms.h"


void Vtest___024root__trace_chg_0_sub_0(Vtest___024root* vlSelf, VerilatedVcd::Buffer* bufp);

void Vtest___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root__trace_chg_0\n"); );
    // Init
    Vtest___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vtest___024root*>(voidSelf);
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    if (VL_UNLIKELY(!vlSymsp->__Vm_activity)) return;
    // Body
    Vtest___024root__trace_chg_0_sub_0((&vlSymsp->TOP), bufp);
}

void Vtest___024root__trace_chg_0_sub_0(Vtest___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root__trace_chg_0_sub_0\n"); );
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode + 1);
    // Body
    if (VL_UNLIKELY((vlSelf->__Vm_traceActivity[1U] 
                     | vlSelf->__Vm_traceActivity[2U]))) {
        bufp->chgBit(oldp+0,(vlSelf->centerLight_testbench__DOT__L));
        bufp->chgBit(oldp+1,(vlSelf->centerLight_testbench__DOT__R));
        bufp->chgBit(oldp+2,(vlSelf->centerLight_testbench__DOT__NL));
        bufp->chgBit(oldp+3,(vlSelf->centerLight_testbench__DOT__NR));
        bufp->chgBit(oldp+4,(vlSelf->centerLight_testbench__DOT__reset));
    }
    bufp->chgBit(oldp+5,(vlSelf->centerLight_testbench__DOT__lightOn));
    bufp->chgBit(oldp+6,(vlSelf->centerLight_testbench__DOT__clk));
    bufp->chgBit(oldp+7,(vlSelf->centerLight_testbench__DOT__dut__DOT__ps));
    bufp->chgBit(oldp+8,(vlSelf->centerLight_testbench__DOT__dut__DOT__ns));
}

void Vtest___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vtest___024root__trace_cleanup\n"); );
    // Init
    Vtest___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vtest___024root*>(voidSelf);
    Vtest__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    vlSymsp->__Vm_activity = false;
    vlSymsp->TOP.__Vm_traceActivity[0U] = 0U;
    vlSymsp->TOP.__Vm_traceActivity[1U] = 0U;
    vlSymsp->TOP.__Vm_traceActivity[2U] = 0U;
}

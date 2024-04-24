// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Tracing implementation internals
#include "verilated_vcd_c.h"
#include "Vmux_2to1__Syms.h"


VL_ATTR_COLD void Vmux_2to1___024root__trace_init_sub__TOP__0(Vmux_2to1___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_init_sub__TOP__0\n"); );
    // Init
    const int c = vlSymsp->__Vm_baseCode;
    // Body
    tracep->pushPrefix("mux_2to1_tb", VerilatedTracePrefixType::SCOPE_MODULE);
    tracep->declBus(c+6,0,"PERIOD",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::PARAMETER, VerilatedTraceSigType::LOGIC, false,-1, 31,0);
    tracep->declBit(c+1,0,"a",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+2,0,"b",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+3,0,"sel",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+4,0,"out",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+5,0,"clk",-1, VerilatedTraceSigDirection::NONE, VerilatedTraceSigKind::VAR, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->pushPrefix("uut", VerilatedTracePrefixType::SCOPE_MODULE);
    tracep->declBit(c+1,0,"a",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+2,0,"b",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+3,0,"sel",-1, VerilatedTraceSigDirection::INPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->declBit(c+4,0,"out",-1, VerilatedTraceSigDirection::OUTPUT, VerilatedTraceSigKind::WIRE, VerilatedTraceSigType::LOGIC, false,-1);
    tracep->popPrefix();
    tracep->popPrefix();
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_init_top(Vmux_2to1___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_init_top\n"); );
    // Body
    Vmux_2to1___024root__trace_init_sub__TOP__0(vlSelf, tracep);
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_const_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
VL_ATTR_COLD void Vmux_2to1___024root__trace_full_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
void Vmux_2to1___024root__trace_chg_0(void* voidSelf, VerilatedVcd::Buffer* bufp);
void Vmux_2to1___024root__trace_cleanup(void* voidSelf, VerilatedVcd* /*unused*/);

VL_ATTR_COLD void Vmux_2to1___024root__trace_register(Vmux_2to1___024root* vlSelf, VerilatedVcd* tracep) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_register\n"); );
    // Body
    tracep->addConstCb(&Vmux_2to1___024root__trace_const_0, 0U, vlSelf);
    tracep->addFullCb(&Vmux_2to1___024root__trace_full_0, 0U, vlSelf);
    tracep->addChgCb(&Vmux_2to1___024root__trace_chg_0, 0U, vlSelf);
    tracep->addCleanupCb(&Vmux_2to1___024root__trace_cleanup, vlSelf);
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_const_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp);

VL_ATTR_COLD void Vmux_2to1___024root__trace_const_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_const_0\n"); );
    // Init
    Vmux_2to1___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmux_2to1___024root*>(voidSelf);
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    Vmux_2to1___024root__trace_const_0_sub_0((&vlSymsp->TOP), bufp);
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_const_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_const_0_sub_0\n"); );
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode);
    // Body
    bufp->fullIData(oldp+6,(0xaU),32);
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_full_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp);

VL_ATTR_COLD void Vmux_2to1___024root__trace_full_0(void* voidSelf, VerilatedVcd::Buffer* bufp) {
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_full_0\n"); );
    // Init
    Vmux_2to1___024root* const __restrict vlSelf VL_ATTR_UNUSED = static_cast<Vmux_2to1___024root*>(voidSelf);
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    // Body
    Vmux_2to1___024root__trace_full_0_sub_0((&vlSymsp->TOP), bufp);
}

VL_ATTR_COLD void Vmux_2to1___024root__trace_full_0_sub_0(Vmux_2to1___024root* vlSelf, VerilatedVcd::Buffer* bufp) {
    (void)vlSelf;  // Prevent unused variable warning
    Vmux_2to1__Syms* const __restrict vlSymsp VL_ATTR_UNUSED = vlSelf->vlSymsp;
    VL_DEBUG_IF(VL_DBG_MSGF("+    Vmux_2to1___024root__trace_full_0_sub_0\n"); );
    // Init
    uint32_t* const oldp VL_ATTR_UNUSED = bufp->oldp(vlSymsp->__Vm_baseCode);
    // Body
    bufp->fullBit(oldp+1,(vlSelf->mux_2to1_tb__DOT__a));
    bufp->fullBit(oldp+2,(vlSelf->mux_2to1_tb__DOT__b));
    bufp->fullBit(oldp+3,(vlSelf->mux_2to1_tb__DOT__sel));
    bufp->fullBit(oldp+4,(((IData)(vlSelf->mux_2to1_tb__DOT__sel)
                            ? (IData)(vlSelf->mux_2to1_tb__DOT__b)
                            : (IData)(vlSelf->mux_2to1_tb__DOT__a))));
    bufp->fullBit(oldp+5,(vlSelf->mux_2to1_tb__DOT__clk));
}

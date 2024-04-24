// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Design implementation internals
// See Vmux_2to1.h for the primary calling header

#include "Vmux_2to1__pch.h"
#include "Vmux_2to1__Syms.h"
#include "Vmux_2to1___024root.h"

void Vmux_2to1___024root___ctor_var_reset(Vmux_2to1___024root* vlSelf);

Vmux_2to1___024root::Vmux_2to1___024root(Vmux_2to1__Syms* symsp, const char* v__name)
    : VerilatedModule{v__name}
    , __VdlySched{*symsp->_vm_contextp__}
    , vlSymsp{symsp}
 {
    // Reset structure values
    Vmux_2to1___024root___ctor_var_reset(this);
}

void Vmux_2to1___024root::__Vconfigure(bool first) {
    (void)first;  // Prevent unused variable warning
}

Vmux_2to1___024root::~Vmux_2to1___024root() {
}

// Verilated -*- C++ -*-
// DESCRIPTION: Verilator output: Symbol table internal header
//
// Internal details; most calling programs do not need this header,
// unless using verilator public meta comments.

#ifndef VERILATED_VSIMPLE_TESTBENCH__SYMS_H_
#define VERILATED_VSIMPLE_TESTBENCH__SYMS_H_  // guard

#include "verilated.h"

// INCLUDE MODEL CLASS

#include "Vsimple_testbench.h"

// INCLUDE MODULE CLASSES
#include "Vsimple_testbench___024root.h"

// SYMS CLASS (contains all model state)
class alignas(VL_CACHE_LINE_BYTES)Vsimple_testbench__Syms final : public VerilatedSyms {
  public:
    // INTERNAL STATE
    Vsimple_testbench* const __Vm_modelp;
    VlDeleter __Vm_deleter;
    bool __Vm_didInit = false;

    // MODULE INSTANCE STATE
    Vsimple_testbench___024root    TOP;

    // CONSTRUCTORS
    Vsimple_testbench__Syms(VerilatedContext* contextp, const char* namep, Vsimple_testbench* modelp);
    ~Vsimple_testbench__Syms();

    // METHODS
    const char* name() { return TOP.name(); }
};

#endif  // guard

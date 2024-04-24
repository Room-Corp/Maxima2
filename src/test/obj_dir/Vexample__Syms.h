// Verilated -*- SystemC -*-
// DESCRIPTION: Verilator output: Symbol table internal header
//
// Internal details; most calling programs do not need this header,
// unless using verilator public meta comments.

#ifndef VERILATED_VEXAMPLE__SYMS_H_
#define VERILATED_VEXAMPLE__SYMS_H_  // guard

#include "systemc"
#include "verilated_sc.h"
#include "verilated.h"
#include "verilated_vcd_sc.h"

// INCLUDE MODEL CLASS

#include "Vexample.h"

// INCLUDE MODULE CLASSES
#include "Vexample___024root.h"

// SYMS CLASS (contains all model state)
class alignas(VL_CACHE_LINE_BYTES)Vexample__Syms final : public VerilatedSyms {
  public:
    // INTERNAL STATE
    Vexample* const __Vm_modelp;
    bool __Vm_dumping = false;  // Dumping is active
    VerilatedMutex __Vm_dumperMutex;  // Protect __Vm_dumperp
    VerilatedVcdSc* __Vm_dumperp VL_GUARDED_BY(__Vm_dumperMutex) = nullptr;  /// Trace class for $dump*
    bool __Vm_activity = false;  ///< Used by trace routines to determine change occurred
    uint32_t __Vm_baseCode = 0;  ///< Used by trace routines when tracing multiple models
    VlDeleter __Vm_deleter;
    bool __Vm_didInit = false;

    // MODULE INSTANCE STATE
    Vexample___024root             TOP;

    // CONSTRUCTORS
    Vexample__Syms(VerilatedContext* contextp, const char* namep, Vexample* modelp);
    ~Vexample__Syms();

    // METHODS
    const char* name() { return TOP.name(); }
    void _traceDumpOpen();
    void _traceDumpClose();
};

#endif  // guard

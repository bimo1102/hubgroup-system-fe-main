/**
 * The enumeration for the time units
 */
export enum TimeUnit {
    Millisecond     = 'millisecond',
    Second          = 'second',
    Minute          = 'minute',
    Hour            = 'hour',
    Day             = 'day',
    Week            = 'week',
    Month           = 'month',
    Quarter         = 'quarter',
    Year            = 'year'
}

/**
 * Type alias for duration values
 */
export type Duration = number


/**
 * The enumeration for the supported constraint types
 */
export enum ConstraintType {
    /**
     * "Must start on" constraint.
     * Restricts an event to start on a [[HasDateConstraintMixin.constraintDate|specified date]].
     * The constraint cannot be used for a summary event.
     */
    MustStartOn         = 'muststarton',
    /**
     * "Must finish on" constraint.
     * Restricts an event to finish on a [[HasDateConstraintMixin.constraintDate|specified date]].
     * The constraint cannot be used for a summary event.
     */
    MustFinishOn        = 'mustfinishon',
    /**
     * "Start no earlier than" constraint.
     * Restricting an event to start on or after a [[HasDateConstraintMixin.constraintDate|specified date]].
     */
    StartNoEarlierThan  = 'startnoearlierthan',
    /**
     * "Start no later than" constraint.
     * Restricting an event to start on or before a [[HasDateConstraintMixin.constraintDate|specified date]].
     *
     * The constraint cannot be used for a summary task.
     */
    StartNoLaterThan    = 'startnolaterthan',
    /**
     * "Finish no earlier than" constraint.
     * Restricting an event to finish on or after a [[HasDateConstraintMixin.constraintDate|specified date]].
     *
     * The constraint cannot be used for a summary task.
     */
    FinishNoEarlierThan = 'finishnoearlierthan',
    /**
     * "Finish no later than" constraint.
     * Restricting an event to finish on or before a [[HasDateConstraintMixin.constraintDate|specified date]].
     */
    FinishNoLaterThan   = 'finishnolaterthan'
}


/**
 * The enumeration for the supported scheduling modes
 */
export enum SchedulingMode {
    Normal              = 'Normal',
    FixedDuration       = 'FixedDuration',
    FixedEffort         = 'FixedEffort',
    FixedUnits          = 'FixedUnits'
}


/**
 * The enumeration for the dependency validation result
 */
export enum DependencyValidationResult {
    /**
     * Dependency has no errors
     */
    NoError               = 0,
    /**
     * Indicates that the validated dependency builds a cycle
     */
    CyclicDependency      = 1,
    /**
     * Indicates that a dependency with the same predecessor and successor as validated one's already exists
     */
    DuplicatingDependency = 2
}


/**
 * The enumeration for the supported dependency types
 */
export enum DependencyType {
    /**
     * Start-to-Start (_SS_)
     *
     * With this dependency type, the succeeding event is delayed to start not earlier than the preceding event starts.
     */
    StartToStart = 0,
    /**
     * Start-to-Finish (_SF_)
     *
     * The finish of the succeeding event is constrained by the start of the preceding event.
     * So the successor cannot finish before the predecessor starts.
     */
    StartToEnd   = 1,
    /**
     * Finish-to-Start (_FS_)
     *
     * This type of dependency, restricts the dependent event to not start earlier than the preceding event finishes.
     */
    EndToStart   = 2,
    /**
     * Finish-to-Finish (_FF_)
     *
     * The succeeding event cannot finish before the completion of the preceding event.
     */
    EndToEnd     = 3
}


/**
 * The enumeration for the supported sources of the calendar for the dependency.
 */
export enum DependenciesCalendar {
    Project    = "Project",
    FromEvent  = "FromEvent",
    ToEvent    = "ToEvent"
}


/**
 * Engine provides with different project types, the enumeration describes the types currently available
 */
export enum ProjectType {
    SchedulerBasic = 1,
    SchedulerPro   = 2,
    Gantt          = 3,
}

/**
 * The enumeration for the scheduling direction
 */
export enum Direction {
    /**
     * Forward (or As Soon As Possible (ASAP)) scheduling.
     */
    Forward = 'Forward',
    /**
     * Backward (or As Late As Possible (ALAP)) scheduling.
     */
    Backward = 'Backward',
    None = 'None'
}

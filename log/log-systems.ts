/**
 * Constants for Echo logging system names.
 * Using constants ensures consistency and prevents typos.
 */
export class LogSystems {
  /** System for profiling and performance measurements */
  static readonly PROFILING = 'Profiling';
  
  /** System for general application logs */
  static readonly GENERAL = 'General';
  
  /** System for Git-related operations */
  static readonly GIT = 'Git';
  
  /** System for UI and visual operations */
  static readonly UI = 'UI';
  
  /** System for repository operations */
  static readonly REPOSITORY = 'Repository';
}

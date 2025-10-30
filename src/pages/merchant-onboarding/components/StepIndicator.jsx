import React from 'react';
import Icon from '../../../components/AppIcon';

const StepIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps?.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <React.Fragment key={step?.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                    ${isCompleted 
                      ? 'border-success bg-success text-white' 
                      : isActive 
                        ? 'border-accent bg-accent text-white shadow-glow' 
                        : 'border-border bg-card text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Icon name="Check" size={20} color="white" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="mt-3 text-center">
                  <div
                    className={`
                      text-sm font-medium transition-colors duration-200
                      ${isActive 
                        ? 'text-accent' 
                        : isCompleted 
                          ? 'text-success' :'text-muted-foreground'
                      }
                    `}
                  >
                    {step?.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-24 hidden sm:block">
                    {step?.description}
                  </div>
                </div>
              </div>
              {/* Connector Line */}
              {index < steps?.length - 1 && (
                <div className="flex-1 mx-4 mt-[-24px]">
                  <div
                    className={`
                      h-0.5 w-full transition-colors duration-200
                      ${stepNumber < currentStep 
                        ? 'bg-success' :'bg-border'
                      }
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
export default function Loading() {
  return(
    <div className="relative w-screen h-screen flex items-center justify-center overflow-x-hidden">
        <div className="container flex w-full h-full overflow-x-hidden">
          <div className="tree m-auto">
            <div className='branch' style={{ "--x": 0 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 1 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 2 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="branch" style={{ "--x": 3 } as React.CSSProperties}>
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <div className="stem">
              <span style={{ "--i": 0 } as React.CSSProperties}></span>
              <span style={{ "--i": 1 } as React.CSSProperties}></span>
              <span style={{ "--i": 2 } as React.CSSProperties}></span>
              <span style={{ "--i": 3 } as React.CSSProperties}></span>
            </div>
            <span className="shadow"></span>
          </div>
        </div>
      </div>
  )
}
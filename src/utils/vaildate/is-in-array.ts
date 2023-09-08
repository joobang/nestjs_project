import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
  } from 'class-validator';
  
  export function IsInArray(validationOptions?: ValidationOptions) {  // 데커레이터의 인수는 객체에서 참조하려고 하는 다른 속성의 이름과 ValidationOptions 을 받음
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (object: Object, propertyName: string) => {  // registerDecorator 를 호출하는 함수 리턴, 이 함수의 인수로 데커레이터가 선언될 객체와 속성 이름 받음
      registerDecorator({ // registerDecorator 는 ValidationDecoratorOptions 객체를 인수로 받음
        name: 'IsInArray',  // 데커레이터 이름
        target: object.constructor, // 이 데커레이터는 객체가 생성될 때 적용됨.
        propertyName: propertyName,
        options: validationOptions, // 유효성 옵션은 데커레이터의 인수로 전달받은 것을 사용
        constraints: [],  //  이 데커레이터는 속성에 적용되도록 제약을 줌
        validator: {  // validator 속성 안에 유효성 검사 규칙 기술, 이는 ValidatorConstraint Interface 를 구현한 함수
          validate(
            value: any,
            validationArguments?: ValidationArguments,
          ): Promise<boolean> | boolean {
            const adminArray = (validationArguments.object as any)['admin_array'];
            return adminArray.includes(value);
          },
        },
      });
    };
  }
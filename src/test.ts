import "reflect-metadata";
import {Account} from "./test-models/account";
import {AccountDto} from "./test-models/accountDto";
import {autoField} from "./autoMapper/utils/autoField";
import {AutoMapper} from "./autoMapper/autoMapper";
import {Response} from "./test-models/response";
import {Response2} from "./test-models/response2";
import {Response2Dto} from "./test-models/response2Dto";
import {ResponseDto} from "./test-models/responseDto";
import {User} from "./test-models/user";
import {UserDto} from "./test-models/userDto";
import {Xyz} from "./test-models/xyz";
import {XyzDto} from "./test-models/xyzDto";

const autoMapper = new AutoMapper();

console.time('autoMapper.addProfile');
autoMapper.addProfile(AccountDto, Account,
  [
    autoField<AccountDto, Account>(x => x.userDto, x => x.user),
  ],
  [
    autoField<Account, AccountDto>(x => x.user, x => x.userDto),
  ]
);

autoMapper.addProfile(UserDto, User,
  [
    autoField<UserDto, User>(x => x.userId, x => x.xyz),
    autoField<UserDto, User>(x => x.userName, x => x.name),
    autoField<UserDto, User>(x => x.userAge, x => x.age),
    autoField<UserDto, User>(x => x.userAddress, x => x.address),
    autoField<UserDto, User>(x => x.userEmail, x => x.email),
  ],
  [
    autoField<User, UserDto>(x => x.xyz, x => x.userId),
    autoField<User, UserDto>(x => x.name, x => x.userName),
    autoField<User, UserDto>(x => x.age, x => x.userAge),
    autoField<User, UserDto>(x => x.address, x => x.userAddress),
    autoField<User, UserDto>(x => x.email, x => x.userEmail),
  ]
);

autoMapper.addProfile(XyzDto, Xyz);
autoMapper.addProfile(ResponseDto, Response);
autoMapper.addProfile(Response2Dto, Response2,
  [
    autoField<Response2Dto, Response2>(x => x.usersDto, x => x.users),
  ],
  [
    autoField<Response2, Response2Dto>(x => x.users, x => x.usersDto),
  ]
);
console.timeEnd('autoMapper.addProfile');

const xyzDto = new XyzDto();
xyzDto.xyz = 'xyz';
xyzDto.zyx = '123';
xyzDto.user = new UserDto();
xyzDto.user.userId = '1';
xyzDto.user.userName = 'John';
xyzDto.user.userAge = 20;
xyzDto.user.userAddress = '123 Main St';
xyzDto.user.userEmail = 'test@email.com';

const xyz = autoMapper.map<Xyz>(xyzDto);
const xyzDto2 = autoMapper.map<XyzDto>(xyz);
console.log(xyzDto);
console.log(xyz);
console.log(xyzDto2);

console.log('------------------');
const responseDto = new ResponseDto();
responseDto.users = [xyzDto.user];
const response = autoMapper.map<Response>(responseDto);
console.log(responseDto);
console.log(response);

console.log('------------------');
const response2Dto = new Response2Dto();
response2Dto.usersDto = [xyzDto.user];
const response2 = autoMapper.map<Response2>(response2Dto);
console.log(response2Dto);
console.log(response2);



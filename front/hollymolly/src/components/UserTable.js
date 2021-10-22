import React, { useEffect } from 'react';
import UserCard from '../components/UserCard';
import '../assets/font.css';

export default function UserTable() {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <UserCard id={4} nickname="돈암동 민혁이" color="yellow" />
                    </td>
                    <td>
                        <UserCard id={2} nickname="이태원 돈까스" color="orange" ready />
                    </td>
                    <td>
                        <UserCard id={3} nickname="신사동 양꼬치" color="green" ready />
                    </td>
                    <td>
                        <UserCard id={7} nickname="방배동 살쾡이" color="red" ready />
                    </td>
                    <td>
                        <UserCard id={5} nickname="수유동 불주먹" color="pink" />
                    </td>
                    <td>
                        <UserCard id={6} nickname="용두동 쭈꾸미" color="blue" />
                    </td>
                    <td>
                        <UserCard id={1} nickname="인계동 껍데기" color="purple" ready />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
